# Different between original repo

- Webpage now have a Responsive layout.
- Add support for non-ASCII URL by automatic convert it into ASCII character only.
- Automatic add "https://" at the beginning if the URL is invalid.

# Feature may add in future

- Allow user set expired time
- Dark mode for webpage

# ☁️ Link Shortener on Cloudflare Workers

![Using the link shortener to shorten a link](img/overview.gif)

This is a link shortener that runs as a [Cloudflare Worker](https://workers.cloudflare.com/). It's the finished code for the [Build a Link Shortener with Cloudflare Workers tutorial on DEV.to](https://dev.to/mmascioni/build-a-link-shortener-with-cloudflare-workers-1j3i) . To deploy it on your own Cloudflare account, follow these steps:

1. Clone this repo: `git clone https://github.com/uncle-jayden/cloudflare-url-shorter.git`

2. Ensure Wrangler is installed on your local machine and authenticate with Cloudflare:

    ```shell
    $ npm i @cloudflare/wrangler -g
    $ wrangler login
    ```

3. In the project directory, copy the `wrangler.example.toml` file to `wrangler.toml`. Get your Cloudflare Account ID by running `wrangler whoami`. In `wrangler.toml`, replace `ACCOUNT_ID_HERE` with the account ID you get from Wrangler or the Workers dashboard.

4. Create the Workers KV namespace for the shortener:

    ```shell
    $ wrangler kv:namespace create "SHORTEN"
    $ wrangler kv:namespace create "SHORTEN" --preview
    ```

    Copy the `id` you get in the terminal output to `wrangler.toml` in place of `ID_HERE`, and copy the `preview_id` you get in the terminal output in place of `PREVIEW_ID_HERE`.

5. Deploy the Worker: `wrangler publish`
