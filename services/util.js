const { Axios } = require("axios");
const axios = new Axios();
const { createWriteStream } = require("fs");

module.exports.downloadFile = async function downloadFile(
  fileUrl,
  downloadPath
) {
  const writer = createWriteStream(downloadPath);

  console.log(fileUrl);
  return axios.get(fileUrl, { responseType: "stream" }).then((response) => {
    return new Promise((resolve, reject) => {
      response.data.pipe(writer);
      let error = null;
      writer.on("error", (err) => {
        error = err;
        writer.close();
        reject(err);
      });
      writer.on("close", () => {
        if (!error) {
          resolve(true);
        }
        //no need to call the reject here, as it will have been called in the
        //'error' stream;
      });
    }).catch((err) => {
      console.log(err.message);
    });
  });
};
