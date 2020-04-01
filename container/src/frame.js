import upperFirst from 'lodash/upperFirst';

export default async (frameName, host) => {
    // constants
    const scriptID = `${frameName}-scripts`;
    const containerID = `${frameName}-frame`;
    const jsPackageName = `${frameName}.[chunkhash].umd.min.js`;
    const methodName = `${upperFirst(frameName)}Frame`;
    const mountFnName = `mount${methodName}`;
    // load frame function     
    const loadFrame = async () => {
        const res = await fetch(`${host}asset-manifest.json`);
        const manifest = await res.json();
        const script = document.createElement('script');
        const moduleName = manifest[jsPackageName].split('.').slice(0, 2).join('.');
        script.setAttribute('type', 'text/javascript');
        script.setAttribute('src', `${host}${manifest[jsPackageName]}`);
        script.setAttribute('crossOrigin', true);
        script.setAttribute('id', scriptID);
        document.body.appendChild(script);
        return new Promise((resolve, reject) => {
            script.onload = () => {
                if (!(moduleName in window)) {
                    reject(`Failed to load ${frameName} Frame`);
                    return;
                }
                resolve(moduleName);
            };
        });
    };
    // load frame
    const moduleName = await loadFrame();
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
            return <main><div id={containerID} /></main>;
        },
    };
};
