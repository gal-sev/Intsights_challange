import axios from "axios";
import cheerio from "cheerio";

interface pasteI {
	author: string,
	title: string,
	shortPaste: string,
	fullPaste: string,
	date: string
};

export function getWebsiteInfo() {	
	axios({
		url: "http://strongerw2ise74v3duebgsvug4mehyhlpa7f6kfwnas7zofs3kov7yd.onion/all",
		proxy: {
			host: "localhost",
			port: 8118,
		},
	}).then(res => {
		const html = res.data;
		const $ = cheerio.load(html);
		// Scrape the titles
		let titles: string[] = [];
		$('.col-sm-5', html).each((_index, element) => {
			titles.push($(element).text().trimStart().trimEnd());
		});
		// Scrape the dates and author
		let dates: string[] = [];
		let authors: string[] = [];
		$('.col-sm-6:even', html).each((_index, element) => {
			const textAsArray = $(element).text().trimStart().trimEnd().split(" ");
			const author = textAsArray[2];
			const date = new Date(textAsArray[4] + textAsArray[5] + textAsArray[6]);
			authors.push(author);
			dates.push(date.toDateString());
		});

		// Scrape the short pastes
		let shortPastes: string[] = [];
		$('.well.well-sm.well-white.pre', html).each((_index, element) => {
			shortPastes.push($(element).text().trimStart().trimEnd());
		});
		
		// Create the pastes list, without the fullPaste
		let pastes: pasteI[] = [];
		for (let i = 0; i < titles.length; i++) {
			pastes.push({
				author: authors[i],
				title: titles[i],
				shortPaste: shortPastes[i],
				fullPaste: "",
				date: dates[i]
			});
		}

		// Fetch the full pastes
		// Get the link from the buttons
		let fullPasteCount = 0;
		$('.btn', html).each((paste_btn_index, element) => {
			const rawLink = $(element).attr("href");
			console.log("Fetching from " + rawLink);
			axios({
				url: rawLink,
				proxy: {
					host: "localhost",
					port: 8118,
				},
			}).then(res => {
				const htmlRaw = res.data;
				$('.well.well-sm.well-white.pre', htmlRaw).each((_index, element) => {
					// Insert the fullpaste to the according paste from the list
					pastes[paste_btn_index].fullPaste = ($(element).text().trimStart().trimEnd());
					fullPasteCount++;
					console.log("current fullpaste fetched: " + fullPasteCount);
				});
				// If fullPastes fetches are finished:
				if (fullPasteCount === pastes.length) {
					console.log(pastes);
				}
			}).catch(err => console.log(err));
		});
	}).catch(err => console.log("Axios ERROR: ", err, "END OF AXIOS ERROR"));
}