const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");

const settings = {
    distPath: path.join(__dirname, "dist"),
    srcPath: path.join(__dirname, "src")
};

function srcPathExtend(subpath) {
    return path.join(settings.srcPath, subpath)
}

module.exports = (env, options) => {
    const isDevMode = options.mode === "development";
    return {
        devtool: isDevMode ? "source-map" : false,
        output: {
            filename: 'bundle.js'
        },
        resolve: {
            extensions: [".js"],
        },
        module: {
            rules: [
                {
                    test: /\.js?$/,
                    use: ["babel-loader"],
                    exclude: /node_modules/,
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                          loader: "style-loader" // creates style nodes from JS strings
                        },
                        {
                          loader: "css-loader" // translates CSS into CommonJS
                        },
                        {
                          loader: "sass-loader" // compiles Sass to CSS
                        }
                      ],
                    exclude: /node_modules/,
                }
            ]
        },
        plugins: [
            new CleanWebpackPlugin({
                verbose: true,
                dry: false
            }),
          
            new HtmlWebpackPlugin({
                template: srcPathExtend("index.html")
            })
        ]
    };
};