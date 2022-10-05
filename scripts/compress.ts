import fs from "fs";
import compress from "brotli/compress";

const assetDir = "public/assets/";
fs.readdirSync(assetsDir).forEach((file) => {
    if (
        file.endsWith(".js") ||
        file.endsWith(".css") ||
        file.endsWith(".html")
    ) {
        const result = compress(fs.readFileSync(assetsDir + file), {
            mode: 1,
            skipLarger: true,
        });
        fs.writeFileSync(assetsDir + file + ".br", result);
    }
});
