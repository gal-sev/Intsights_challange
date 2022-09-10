import axios from "axios";
import cheerio from "cheerio";

export interface pasteI {
	author: string,
	title: string,
	contentShort: string,
	contentFull: string,
	date: string
};

export function getWebsiteInfo() {
	return new Promise((resolve, reject) => {
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
			let contentShorts: string[] = [];
			$('.well.well-sm.well-white.pre', html).each((_index, element) => {
				contentShorts.push($(element).text().trimStart().trimEnd());
			});
			
			// Create the pastes list, without the contentFull
			let pastes: pasteI[] = [];
			for (let i = 0; i < titles.length; i++) {
				pastes.push({
					author: authors[i],
					title: titles[i],
					contentShort: contentShorts[i],
					contentFull: "",
					date: dates[i]
				});
			}
	
			// Fetch the full contents
			// Get the link from the buttons
			let contentFullCount = 0;
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
					const pasteHtml = res.data;
					$('.well.well-sm.well-white.pre', pasteHtml).each((_index, element) => {
						// Insert the contentFull to the according paste from the list
						pastes[paste_btn_index].contentFull = ($(element).text().trimStart().trimEnd());
						contentFullCount++;
						console.log("ContentFulls fetched count: " + contentFullCount);
					});
					// If contentFulls fetches are finished:
					if (contentFullCount === pastes.length) {
						resolve(pastes);
					}
				}).catch(err => {
					reject({message: 'Rejected error: ' + err});
				});
			});
		}).catch(err => {
			reject({message: 'Rejected error: ' + err});
		});
	});
}