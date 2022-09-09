import axios from "axios";
import cheerio from "cheerio";

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
		//Get every div element with this class
		$('.col-sm-5', html).each((_index, element) => {
			titles.push($(element).text().trimStart().trimEnd());
		});
		console.log(titles);
		
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
		console.log(authors);
		console.log(dates);

	}).catch(err => console.log("Axios ERROR: ", err, "END OF AXIOS ERROR"));
}