# Micro FrontEnd - Vue JS
Imagine you’re working on an online shopping project with a huge code base, what would be the biggest challenge?
Let me guess Time Complexity, Space Complexity and so on, am I right?
Of course not! Time and Space complexity are important but they have lower priority in comparison with Code Maintenance, Build and test process Time.
Let me talk a little bit more about the project. We have 4 major sections and each section will be developed by a small team. Each team will work on their domains and then push on to the specific branch, So They will open an issue and create a pull request. Everything is fine!
Every front end developer knows maintaining a project is too hard over years. This will be unbeatable if we work on a **monolith architecture**.

### What does monolith mean in front end projects?
<img src="https://lh4.googleusercontent.com/rIE0GEu4DX4CTmbs0HjBU1BsJWjo8-Iaa8Vhs43s59PI5cxFqOBa_CGVCAFiROvimB6mGXSbBrN25BZxNI8GjgyjHIjuEPMDY-VtGJ4q1eohOL7_J024z6tRpA8W93lCq6J_Z_Mt" width="400px" />
  
This means we put all of our domains in the main project and then bundle them with `rollup` or other tools, then try to serve them.
Finally after build process, we have one package containing files and it’s chunks.

<img src="https://lh3.googleusercontent.com/FgltooWKLNyjLD54-9XA3Gc5IXcw0S1K1OkcfQXn3yhzLl_w-JDntY4jyKrs0ruMnjF14H_6lL_wlUG_b7LBYnzBK4aSkksqDX-LejXpZGumefh5WENqzoWG8T79KgJmzC9bzJtW" width="200px" />

### What’s the problem?
Imagining we need to make tiny changes on `Books` domain so as is clear we should run our pipeline.
Our pipeline will analyze, build and then run tests. This process got too long, maybe sometimes you decide to skip tests.

### What would be a better solution ?
In my view, we don't have absolute best solution in the world so we should looking for better solution about our situations.
Let’s think about separation of domains, I mean make a new project named `Digitals`, another project which name is `Books` and then serve them on the separate machines or ports:

<img src="https://lh3.googleusercontent.com/nGVsH9aclDyFHoPRrb586q1D9-qiT5f6LApYBAk2J83mRszei_gxx5kUTzffqpxkUUM61CMhMJ12N3CK1Q_kAss2tP2hqUlP-xXMrfkCeHIUUkeFBJtMKm0DHdK2R1g3vitjDy42" width="700px" />

### Benefits
1.  Concurrent build and tests.
2.  Separate build and increase updates and publishes.
3.  Each project is much smaller and cleaner and more maintainable.
4.  Independent code bases, which means we can refactor and rewrite or change architecture of each part of project every time we need, even change its frameworks.

### Implementation
So let's Implement Micro front end Architecture with Vue JS (javascript framework).
Main principle in implementation of this architecture is to find a way to get modules from related projects.

#### Container application
> Container application renders common pages and common components like `header`, `footer` and will contain pages like `login`, `logout` and `user operations`.

<img src="https://lh4.googleusercontent.com/NinumStRQx9X5e5xFv4OVbP3mZyz9916PLvqFw8-rDsCzsR1WkjPqYt_n1EzbHvYUkQZa8Zg1ax6Kduiy-3vH_s-izKN0tVKNyODUutKxVkc-10cZtouO2TkUJN5YN_4FTkgQsYC" width="500px" />

On the container project, have routes like `/books` , `/vehicles` and etc. When a user requests for `/books` router will load the component, here is the turning point where we should fetch components from outside of the bundle.

We’ve made a `/books` resource on a separate project and it’s ready. Define address of books project on `.env` file and if you are using `vue-cli@3` be aware about `VUE_APP_` prefix.

First I should talk about how to build `Books` project. If we try to build books project with this command `vue-cli-service build` we cannot use this on our container so we need to change `libraryTarget` to `UMD` so let’s build with this command: 
```bash
$ yarn build --target lib --formats umd-min --name "<PROJECT_NAME>.[chunkhash]" src/main.js 
```
We will be facing with one or more javascript files and its map files in `dist` directory.
After the build, we need to import the javascript file with hash to our project but this hash will change when the file content changes.
So we need an`assets-manifest.json` file, this file will help up to find this javascript file.
Let’s install this `webpack` plugin and rebuild. 
```bash
$ yarn add -D webpack-assets-manifest
```
Add this to your `vue.config.js`
```javascript
const  WebpackAssetsManifest  =  require('webpack-assets-manifest');
module.exports  = {
	configureWebpack: config => {
		config.plugins  =  config.plugins.concat(
			new  WebpackAssetsManifest({
				output:  'asset-manifest.json',
			}));
	},
}
```
Switch on the container project(*online shopping*), we need to make a frame function to load our component remotely.
Create a `frame.js` file beside of `main.js`, Frame function will act like a frame tag.
Frame function will create a script tag, load Book module, create element and then mount loaded module to created element. **Just this, this is the whole concept.**
```javascript
// ./src/frame.js  
import upperFirst from  'lodash/upperFirst';

export  default  async (frameName, host) => {
	// constants
	const  scriptID  =  `${frameName}-scripts`;
	const  containerID  =  `${frameName}-frame`;
	const  jsPackageName  =  `${frameName}.[chunkhash].umd.min.js`;
	const  methodName  =  `${upperFirst(frameName)}Frame`;
	const  mountFnName  =  `mount${methodName}`;
	// load frame function
	const  loadFrame  =  async () => {
		const  res  =  await  fetch(`${host}asset-manifest.json`);
		const  manifest  =  await  res.json();
		const  script  =  document.createElement('script');
		const  moduleName  = manifest[jsPackageName].split('.').slice(0, 2).join('.');
		script.setAttribute('type', 'text/javascript');
		script.setAttribute('src', `${host}${manifest[jsPackageName]}`);
		script.setAttribute('crossOrigin', true);
		script.setAttribute('id', scriptID);
		document.body.appendChild(script);
		return  new  Promise((resolve, reject) => {
			script.onload  = () => {
				if (!(moduleName in window)) {
					reject(`Failed to load ${frameName} Frame`);
					return;
				}
				resolve(moduleName);
			};
		});
	};
	// load frame
	const  moduleName  =  await  loadFrame();
	return {
		mounted() {
			try {
			window[moduleName].default[mountFnName](frameName, containerID);
			} catch (e) {
			// an error occured on ${moduleName} execution.
			}
		},
		destroyed() {
			console.log(`'/vehicles' route destoryed`);
		},
		render () {
			return  <main><div  id={containerID} /></main>;
		},
	};
};
```
After route navigation we should see the loaded module in container app.
```javascript
// main.js or router.js
import Frame from './frame.js';
const {
	VUE_APP_BUS_HOST: vehicleHost, // define environment variables in .env file.
} =  process.env;
const router =  new  VueRouter({
	mode:  'history',
	base:  '/',
	routes: [
		{ path:  '/vehicle', component:  Frame('vehicle', vehicleHost) },
	]
});
```
### Micro Frontend downsides
On the other side of micro front end benefits we have some disadvantages.

#### Bundle size
Micro front end architecture will increase payload size, so we need to recognize common bundles and externalize them from our projects (`onlineShopping` , `books`, `vehicles` and etc)
run this command to help us add external resources.
```bash
$ yarn add -D vue-cli-plugin-externals
or
$ vue add externals
```
```javascript
// vue.config.js
pluginOptions: {
	externals: {
		common: [{
			id:  'vue',
			assets: [{
				path:  'https://unpkg.com/vue@2.6.11/dist/vue.js',
				type:  'js'
			}],
			global: 'Vue'
		}]
	}
},
```
We should add this configurations for other libraries like `vue`, `vue-router` and `axios`  these libraries are common and will use on container and other projects.
Now we will have at least 4 request to load our common assets but we can concat them in one file while their size is below `250KB` as it has been defined on webpack configuration.

##### Common (A new project)
Create new directory and write some webpack configurations to pack multiple libraries in one file.
```javascript
// ./webpack.config.js
const path = require('path');
module.exports  = {
	mode: 'production',
	entry: './vendors.js',
	performance: {
		hints: 'error', // stop building process!!!!!!
		maxEntrypointSize: 250000, // default value
		maxAssetSize: 250000, // default value
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'vendors.js',
		chunkFilename: '[id].js',
		publicPath: '/',
		globalObject: 'this',
		libraryTarget: 'umd',
	},
};
```
import your common libraries into `vendors.js` file and then build and deploy.
```javascript
// ./src/vendors.js
const  vue  =  require('vue');
const  vueRouter  =  require('vue-router');
module.exports  = {
	Vue:  vue.default,
	VueRouter:  vueRouter.default,
};
```
This could be your new `vue.config.js`:
```javascript
pluginOptions: {
	externals: {
		common: [{
			id:  'vendors',
			assets: [{
				path:  process.env.VENDORS,
				type:  'js',
			}],
		}]
	}
},
```
#### Complexity
Next issue of micro frontend architecture is complexity. Totally monolith architecture is more simple than micro-service architecture, so we should considering about infrastructures that devOps can provides for teams. Testing and build process should be scaleable.

## Resources
[martinfowler micro-frontends](https://martinfowler.com/articles/micro-frontends.html)
