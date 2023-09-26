import axios from "axios";
import { load } from "cheerio";
import store, { RootState } from "../redux/store";
import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const allValidPrefixes = ["", "www."];

// const sender = {
//   name: "Jirazo",
//   organisation: "Sight3",
//   title: "Technical Director",
//   organisationDescription: "creative design and software development agency",
// };

export function callAPI(url: string) {
  return new Promise((resolve, reject) => {
    // Make the API call
    setTimeout(
      () =>
        axios
          .request({
            method: "GET",
            url,
          })
          .then((response) => {
            if (response.data) {
              const html = response.data.toString();
              console.log(html);
              const $ = load(html);
              const title =
                $('meta[property="og:title"]').attr("content") ||
                $("title").text() ||
                $('meta[name="title"]').attr("content");
              const description =
                $('meta[property="og:description"]').attr("content") ||
                $('meta[name="description"]').attr("content");
              const url = $('meta[property="og:url"]').attr("content");
              const site_name = $('meta[property="og:site_name"]').attr(
                "content"
              );
              const image =
                $('meta[property="og:image"]').attr("content") ||
                $('meta[property="og:image:url"]').attr("content");
              const icon =
                $('link[rel="icon"]').attr("href") ||
                $('link[rel="shortcut icon"]').attr("href");
              const keywords =
                $('meta[property="og:keywords"]').attr("content") ||
                $('meta[name="keywords"]').attr("content");
              // just consoling the variables
              const parsedData = {
                title,
                description,
                url,
                site_name,
                image,
                icon,
                keywords,
              };
              resolve(parsedData); // Resolve the promise with the parsed JSON data
            } else {
              reject("API request failed"); // Reject the promise with an error message
            }
          })
          .catch((error) => {
            reject(error); // Reject the promise with the error received
          }),
      2000
    );
  });
}

export const scrape = async (url: string) => {
  for (let i = 0; i < allValidPrefixes.length; i++) {
    console.log("CALLLING url : ", url);
    try {
      const res = await callAPI(
        `https://scrape.abstractapi.com/v1/?api_key=${process.env.SCRAPPER_API_KEY}&url=https://` +
          allValidPrefixes[i] +
          url
      );
      return res;
    } catch (err) {
      console.log("ERR CALLING URL : ", err);
      return undefined;
    }
  }
};

export const scrapeData = async (
  label: string,
  data: Array<any>,
  setProgress: (n: number) => void,
  setStatus: (s: string) => void,
  setMetadata: (a: any) => void,
  addToEmails: (a: { email: string; metadata: any; data: any }) => void,
  increaseFailedCount: () => void
) => {
  const user = store.getState().state.user;

  const length = 10;
  data = data.slice(0, length);
  const metadata = {};
  for (let i = 0; i < length; i++) {
    console.log("DATA : ", data);
    const url = data?.[i]?.[label];

    // Scrapping Website
    setStatus("Scrapping " + url);
    const resMetadata = await scrape(url);

    // Generating Email
    if (resMetadata !== undefined) {
      setStatus("Generating Email for " + url);
      const email = await callDaVinci(user, resMetadata);
      addToEmails({ email, metadata: resMetadata, data: data?.[i] });
    } else {
      increaseFailedCount();
    }
    setProgress(i + 1);

    metadata[url] = resMetadata;
    if (i + 1 === length) {
      setStatus("SCRAPED SUCCESFULLY. Generating Smart Emails now!");
    }
    console.log("axiosResponse : ", url, " : ", data);
  }
  setMetadata(metadata);
  return metadata;
};

export const callDaVinci = async (user: any, receiver: any) => {
  console.log("callDaVinci user : ", user, receiver);
  const sender = {
    name: user?.name,
    organisation: user?.company?.name,
    title: user?.jobTitle,
    organisationDescription: user?.company?.description,
  };
  const prompt = `Write an Email. The purpose is Outreach emails, the sender name is ${sender.name}, ${sender.title} at ${sender.organisation}, the sender organization is ${sender.organisation}, the receiver organization is ${receiver?.url}, and the additional info is ${sender.organisation} is a ${sender.organisationDescription} and the receiver's org has to do something with ${receiver?.description} \nThe subject should be wrapped around <h1> tag \nThe response should be a properly formatted wrapped in <p> tags as such in HTML, make sure its not just text.\n Please use sender organization, receiver organization and additional info while crafting the email to achieve personalization and the greeting should not exceed 40 characters and the subject should be on the top`;
  console.log("PROMPT : ", prompt);
  const resp = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
    temperature: 1,
    max_tokens: 1000,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  console.log("RESPONSE DAVINCI : ", resp.data.choices[0].text);

  return resp.data.choices[0]?.text;
};

export function parseEmailFromOpenAI(text: string) {
  const temp = text.split("</h1>");
  console.log("parseEmailFromOpenAI TEMP : temp");
  const email = temp[temp.length - 1];
  var subject = text
    .match("<h1>(.*)</h1>")[1]
    .replace("<h1>", "")
    .replace("</h1>", "");

  console.log("parseEmailFromOpenAI SUBJECT : ", subject);
  console.log("parseEmailFromOpenAI email : ", email);
  return {
    email,
    subject,
  };
}
