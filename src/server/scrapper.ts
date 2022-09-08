import axios from "axios";

export async function getWebsiteInfo() {
  await axios({
		url: "http://strongerw2ise74v3duebgsvug4mehyhlpa7f6kfwnas7zofs3kov7yd.onion/all",
		proxy: {
			host: "localhost",
			port: 8118,
		},
	}).then(res => console.log(res));
}