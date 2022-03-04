const formidable = require("formidable");

module.exports.mapFormDataToSearchParams = (req, onFinish) => {
  const form = formidable({ multiples: true });
  form.parse(req, (err, fields) => {
    if (err) {
      console.log("FORM PARSE ERR", err);
    }
    onFinish(new URLSearchParams(fields));
  });
};
