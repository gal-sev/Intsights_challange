import axios from "axios";
import cheerio from "cheerio";

interface pasteI {
	author: string,
	title: string,
	shortPaste: string,
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
		// Scrape the short paste
		//TODO: get the full paste by fetching and scraping the full paste page
		// Scrape the dates and author
		let shortPastes: string[] = [];
		$('.well.well-sm.well-white.pre', html).each((_index, element) => {
			shortPastes.push($(element).text().trimStart().trimEnd());
		});
		let pastes: pasteI[] = [];
		for (let i = 0; i < titles.length; i++) {
			pastes.push({
				author: authors[i],
				title: titles[i],
				shortPaste: shortPastes[i],
				date: dates[i]
			});
		}
		console.log(pastes);
		
	}).catch(err => console.log("Axios ERROR: ", err, "END OF AXIOS ERROR"));
}