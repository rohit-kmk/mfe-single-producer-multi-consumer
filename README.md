# mfe-single-producer-multi-consumer

# Modules

## mysite
AEM project containing the global /common code like header & footer code and global modules like user context.

The ui.frontend module contains code for the Global / Common Module (microfrontend) module.
The global microfrontend module (single producer) code/remoteEntry file gets stored under 
"clientlib-dynamic-modules"

```javascript
        output: {
            filename: (chunkData) => {
                return chunkData.chunk.name === 'dependencies' ? 'clientlib-dependencies/[name].js' :       'clientlib-[name]/[name].js';
            },
            path: path.resolve(__dirname, 'dist'),
		    chunkFilename: 'clientlib-dynamic-modules/resources/[name].js',
		    publicPath: '/etc.clientlibs/mysite/clientlibs/'
        },
        ...
		new ModuleFederationPlugin({
			name: 'app',
			filename: 'clientlib-dynamic-modules/remoteEntry.js',
			remotes: {
				app: "app@[globalModuleAppUrl]"
			},
			exposes: {
				'./helloworld': SOURCE_ROOT + '/components/_mfehelloworld.js',
				'./prime': SOURCE_ROOT + '/site/index.js',
				'./data': SOURCE_ROOT + '/site/data.js'
			}
		}),
```
The Consumer applications can access the remote entry file can be accessed using path: http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js

Application Url: http://localhost:4502/content/mysite/language-masters/en.html?wcmmode=disabled

## wknd-theme

Theme based microsite/quicksite project.
This module will act as a Container(Consumer) application and consumes the global modules exported by mysite project

```javascript
		new ModuleFederationPlugin({
			name: 'main',
			filename: 'remoteEntry.js',
			remotes: {
				//app: "app@http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js"
				//app: "app@[globalModuleAppUrl]"
				app: `promise new Promise(resolve => {
						  //const urlParams = new URLSearchParams(window.location.search)
						  //const version = urlParams.get('app1VersionParam')
						  console.log('Building module url');
						  // This part depends on how you plan on hosting and versioning your federated modules
						  const remoteUrlWithVersion = 'http://localhost:4502/etc.clientlibs/mysite/clientlibs/clientlib-dynamic-modules.js'
						  const script = document.createElement('script')
						  script.src = remoteUrlWithVersion
						  script.onload = () => {
							// the injected script has loaded and is available on window
							// we can now resolve this Promise
							const proxy = {
							  get: (request) => window.app.get(request),
							  init: (...arg) => {
								try {
								  return window.app.init(...arg)
								} catch(e) {
								  console.log('remote container already initialized')
								}
							  }
							}
							resolve(proxy)
						  }
						  // inject this script with the src set to the versioned remoteEntry.js
						  document.head.appendChild(script);
						})
					`,
			},
			exposes: {
			}
		}),
```
Check file: wknd-theme\src\main\webpack\site\util.js to see producer application modules usage.

Application Url: http://localhost:8080/

