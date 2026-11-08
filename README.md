
# ImageEnhancer

A React + TypeScript web app (built with Vite) that lets users:

1. **Enhance** the quality of an uploaded image
2. **Remove the background** from an uploaded image

Image processing is done through the [PicWish](https://picwish.com) API. This version is **frontend only**.


## Tech stack

- React 18+ with TypeScript
- Vite
- React Router (`react-router-dom`)
- PicWish API

## Getting started

### Prerequisites

- Node.js 18 or newer
- A PicWish API key (from your PicWish API dashboard)

### Install

```bash
npm install
```

### Configure environment variables

Create a `.env` file in the project root (next to `package.json`):

```dotenv
VITE_PICWISH_API_KEY=your_key_here
VITE_PICWISH_BASE_URL=https://techhk.aoscdn.com
VITE_MAX_FILE_MB=10
```

| Variable | Required | Description |
|---|---|---|
| `VITE_PICWISH_API_KEY` | Yes | Your PicWish API key |
| `VITE_PICWISH_BASE_URL` | No | PicWish API address (default `https://techhk.aoscdn.com`, no trailing `/`) |
| `VITE_MAX_FILE_MB` | No | Maximum upload size in MB (default `10`) |


### Run

```bash
npm run dev       # start the dev server
npm run build     # type-check and build for production
npm run preview   # preview the production build locally
npm run lint      # run ESLint
```

## Routes

| Path | Page |
|---|---|
| `/` | Home (landing page) |
| `/process` | Image processing |
| `*` | 404 Not Found |

## How it works

1. The user opens the Home page and clicks **Go Ahead**, which goes to `/process`.
2. The user chooses a mode (Enhance or Remove background) and selects an image.
3. `validateFile` checks the type (JPG, PNG, WebP) and size before anything is uploaded, so no credits are wasted on bad files.
4. `useImageProcess` calls `processImage` in `api/picwish.ts`, which uploads the image to PicWish. If the result is not ready immediately, it polls the task until it is done.
5. The processed image is shown with a download button.

### Request limits (`src/api/picwish.ts`)

| Constant | Value | Meaning |
|---|---|---|
| `REQUEST_TIMEOUT_MS` | 30000 | Max time for a single request |
| `POLL_INTERVAL_MS` | 1500 | Wait between status checks |
| `MAX_POLLS` | 20 | Max number of status checks before giving up |

## Error handling

All failures are converted into a readable message shown to the user:

- Invalid or unauthorized API key
- No API credits left
- Image too large, or unsupported file type
- Too many requests
- Network error
- Request timeout, or processing taking too long

## Troubleshooting

| Problem | Likely cause and fix |
|---|---|
| "Missing environment variable VITE_PICWISH_API_KEY" | `.env` is missing, misnamed, or the dev server was not restarted |
| "The API key is invalid" | Check the key in your PicWish dashboard and `.env` |
| Endpoint or parameter errors | Compare `ENDPOINTS` and the form fields in `api/picwish.ts` with the current PicWish API docs |


## License

This project is licensed under the [MIT License](./LICENSE).