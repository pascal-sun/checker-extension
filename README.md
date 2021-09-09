# Checker extension
Firefox extension to check the presence of HTTP Security Headers and the implementation of the Subresource Integrity (SRI).

## Demo

## Development

### How to develop with `web-ext`, in command line

`web-ext` is a command line tool, to help build, run and test WebExtensions: https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/.

#### How to install it

```console
$ sudo apt install npm
$ sudo npm install --global web-ext
$ web-ext --version
```

#### How to use it

```console
$ cd check-extension
$ web-ext run --firefox-profile=../test-profile --profile-create-if-missing --keep-profile-changes
```
- `--firefox-profile`, `-p`: Specify a base Firefox profile to run the extension in.
- `--profile-create-if-missing`: With this option, the profile directory will be created if it does not exist yet.
- `--keep-profile-changes`: With this option, any changes made to the profile directory are saved.

Make sure to have test-profile folder outside of the extension, for reload issue:
```console
.
├── checker-extension
│   ├── background.js
│   ├── content-script.js
│   ├── icons
│   ├── LICENSE
│   ├── manifest.json
│   ├── popup
│   └── README.md
└── test-profile
```

### Documentation 

#### Storage area

```json
{
	"example.com":{
		"headers-all":{
			"URL1":{
				"header1":"value1",
				"header2":"value2"
			},
			"URL2":{
				"header1":"value1",
				"header2":"value2"
			},
		},
		"headers-security":{
			"strict-transport-security": ["URL1", "URL2"],
			"x-xss-protection": ["URL1"],
			"content-security-policy": ["URL2"],
			"x-frame-options": [],
			"x-content-type-options": [],
			"cache-control": [],
			"server": [],
			"x-powered-by": []
		},
		"linkTags":{
			"allURLs":{
				"hrefURL1":{
					"integrity":"xxxxxxx",
					"crossorigin":"xxxx"
				},
				"hrefURL2":{
					"integrity":"xxxxxxx",
					"crossorigin":"xxxx"
				},
			},
			"example.com/1":{
				"srcURL1":{
					"integrity":"xxxxxxx",
					"crossorigin":"xxxx"
				},
				"srcURL2":{
					"integrity":"xxxxxxx",
					"crossorigin":"xxxx"
				}
			}
			"example.com/2":{},
			"example.com/3":{}
				},
				"scriptTags":{
						"allURLs":{},
						"example.com/1":{},
						"example.com/2":{},
						"example.com/3":{}
				}
		},
		"www.example.com":{
				"linkTags":{
						"allURLs":{},
						"www.example.com/1":{},
						"www.example.com/2":{},
						"www.example.com/3":{}
				},
				"scriptTags":{
						"allURLs":{},
						"www.example.com/1":{},
						"www.example.com/2":{},
						"www.example.com/3":{}
				}
		},
		"google.com":{
				"linkTags":{
						"allURLs":{},
						"google.com/1":{},
						"google.com/2":{},
						"google.com/3":{}
				},
				"scriptTags":{
						"allURLs":{},
						"google.com/1":{},
						"google.com/2":{},
						"google.com/3":{}
				}
		},
}
```
