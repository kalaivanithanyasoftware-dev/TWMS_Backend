import path from 'path';
import { fileURLToPath } from 'url';
//import nodeExternals from 'webpack-node-externals';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    entry: './server.js',
    target: 'node',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.min.cjs'
    },
    //externals: [nodeExternals()], // Exclude node_modules
    mode: 'production'
};
