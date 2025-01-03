# Frontend WKND Theme

## Tutorial

This repository is based on a full tutorial on how to convert a fullstack project to use the new frontend pipeline on Cloud Service.  The full tutorial can be found [here](https://main--about--lamontacrook.hlx.live/). 

## Usage

The following npm scripts drive the frontend workflow:

* `npm run build` - This script is use by the frontend pipeline and local emulation to build the scrips and CSS.
* `npm run live-theme` - This script mimics how a theme would function in the cloud after running through the pipeline.
* `npm run watch` - Watchs for updates to *.css or *.js and builds into the dist folder on save
* `npm run proxy` - Used by frontend devs to proxy the deployed site and mimic a theme.
* `npm run live` - Runs 'watch' and 'proxy' for frontend development.

## Setup

Clone the repository and add a new file named `.env` to the root.  This will tell the proxy where AEM is running for the local sdk to format wound be:


    # AEM url
    AEM_URL=http://localhost:4502/

    # AEM site name
    AEM_SITE=wknd

    # AEM proxy port
    AEM_PROXY_PORT=7000

After creating the `.env` file run `npm i` from the terminal.