#!/usr/local/bin/node

// <xbar.title>Netlify Deploy Status</xbar.title>
// <xbar.version>v1.0</xbar.version>
// <xbar.author>Josh Kennedy</xbar.author>
// <xbar.author.github>joshatoutthink</xbar.author.github>
// <xbar.desc>Shows the current deploy status of your netlify site.</xbar.desc>
// <xbar.image>https://cloud.githubusercontent.com/assets/1476865/24201253/ce0d8c5e-0f0f-11e7-8e44-503654407850.png</xbar.image>
// <xbar.dependencies>node</xbar.dependencies>
// <xbar.var>string(API_TOKEN=""): Your Netlify Personal Access Token.</xbar.var>
// <xbar.var>string(SITE_ID=""): Your Netlify App Id.</xbar.var>

const fetch = require("node-fetch");
// const fs = require("fs");
// const path = require("path");

//IMAGES
const { error } = require("./images/b64-error.js");
const { building } = require("./images/b64-building.js");
const { deployed } = require("./images/b64-deployed.js");

// CONSTANTS
const API_TOKEN = process.env.API_TOKEN;
const SITE_ID = process.env.SITE_ID;

const API_URL = "https://api.netlify.com/api";
const VERSION = "v1";
const RESOURCE = `sites/${SITE_ID}/deploys`;
const PER_PAGE = 1;
// const FILE = process.argv[1;

// Fetch the Shit.
(async function App() {
  // if is not configured say so and exit;
  if (API_TOKEN == "" || SITE_ID == "") {
    console.log(`⚠ Configure | color="#ff1ff0"
		---
		 Edit Settings | href=xbar://app.xabar.com/openPlugin?path=001-ntl-site-status.1m.js
		---
		How to get your App Id | href=https://app.netlify.com/user/applications/personal
		How to get a Personal Access Token | href=https://docs.netlfiy.com/`); //TODO find docs to find App Id
    return;
  }

  const deploy = await fetch(
    `${API_URL}/${VERSION}/${RESOURCE}/?per_page=${PER_PAGE}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res[0])
    .catch((e) => {
      console.log("error", e);
      return { state: "offline" };
    });
  const statusIcon =
    typeof deploy === "undefined" || deploy.state === "offline"
      ? null
      : deploy.state === "error"
      ? error
      : deploy.state === "ready"
      ? deployed
      : building;
  if (!statusIcon) {
    console.log("offline");
  } else {
    console.log(appTemplate(deploy, statusIcon));
  }
})();

function appTemplate(
  { state, name, admin_url, ssl_url, error_message },
  status_icon
) {
  const top = ` ${state} | image=${status_icon}
	---
	${name} | href=${ssl_url}
	netlify dashboard | href=${admin_url}`;

  const errStr =
    state === "error" &&
    `---
	error: ${error_message}`;

  return errStr
    ? `${top} 
	${error}`
    : top;
}
