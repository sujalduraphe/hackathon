# Sample job descriptions

`sample-job-descriptions.csv` is a **synthetic** dataset of job descriptions for
fictional companies, written in the same column layout as a Glassdoor CSV export
(`Job Title`, `Job Description`, `Company Name`, `Location`, ...).

It is loaded by `npm run seed` so the market-demand features have data to show.
Replace it with a real export (Glassdoor, LinkedIn, Naukri or a public job-postings
dataset you are allowed to use) through the institution's **Market Insights** page,
or with `npm run import-jds -- path/to/file.csv "Source name"`.
