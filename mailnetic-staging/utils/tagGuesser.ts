const similarToWebsite = ["website", "domain", "site"];
const similarToEmail = ["email", "e-mail", "mail"];

export const guessWebsiteTag = (row: string[]) => {
  let validTag: string = "";
  for (const x in row) {
    for (const y in similarToWebsite) {
      console.log("checking website tag : ", row[x] ,' == ',similarToWebsite[y] );
      if (row[x].toLocaleLowerCase().includes(similarToWebsite[y])) {
        console.log("valid website tag : ", x);
        validTag = row[x];
        break;
      }
    }
    if (validTag) break;
  }
  return validTag;
};

export const guessEmailTag = (row: string[]) => {
  let validTag: string = "";
  for (const x in row) {
    for (const y in similarToEmail) {
      console.log("checking website tag : ", row[x] ,' == ',similarToEmail[y] );
      if (row[x].toLocaleLowerCase().includes(similarToEmail[y])) {
        console.log("valid email tag : ", x);
        validTag = row[x];
        break;
      }
    }
    if (validTag) break;
  }
  return validTag;
};
