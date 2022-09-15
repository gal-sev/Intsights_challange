import axios from "axios";
import cheerio from "cheerio";
import * as chrono from 'chrono-node';
export interface pasteI {
	id: string,
	author: string,
	title: string,
	content: string,
	date: string
};

export function getWebsiteInfo() {
	return new Promise((resolve, reject) => {
		axios({
			url: "http://paste2vljvhmwq5zy33re2hzu4fisgqsohufgbljqomib2brzx3q4mid.onion/lists",
			proxy: {
				host: "localhost",
				port: 8118,	
			},
		}).then(res => {
			const html = res.data;
			const $ = cheerio.load(html);
			let titleElements = $('.first', html);
			
			// Create an empty pastes list
			let pastes: pasteI[] = [];
			let contentCount = 0;
			for (let i = 0; i < titleElements.length; i++) {
				pastes.push({
					id: "",
					author: "",
					title: "",
					content: "",
					date: ""
				});
			}
			
			titleElements.each((element_index, element) => {
				// Insert the title
				pastes[element_index].title = $(element).text().trimStart().trimEnd();

				//Insert the author and date
				$(element).siblings("td").each((index, sibling) => {
					let sibling_text = $(sibling).text();
					if(index == 0) {
						// Transform unknown authors to "Anonymous"
						if (sibling_text.toLowerCase() == "anonymous" || 
						sibling_text.toLowerCase() == "unknown" ||
						sibling_text.toLowerCase() == "guest") {
							sibling_text = "Anonymous";
						}
						pastes[element_index].author = sibling_text;
					} else if (index == 2) {
						pastes[element_index].date = chrono.parseDate(sibling_text).toUTCString();
					}
				});

				//Insert the id
				const pasteID = $(element).children("a").attr("href")?.split("/")[4];
				pastes[element_index].id = pasteID as string;
				
				//Insert the content
				console.log("Fetching paste " + pasteID);
				axios({
					url: `http://paste2vljvhmwq5zy33re2hzu4fisgqsohufgbljqomib2brzx3q4mid.onion/view/raw/${pasteID}`,
					proxy: {
						host: "localhost",
						port: 8118,
					},
				}).then(res => {
					const content: string = res.data;
					pastes[element_index].content = content.trimStart().trimEnd();
					contentCount++;
					console.log("Contents fetched count: " + contentCount);
					// If content fetches are finished:
					if (contentCount === titleElements.length) {
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