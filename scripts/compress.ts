import fs from "fs";
import compress from "brotli/compress";

const assetsDir = "public/assets/";
fs.readdirSync(assetsDir).forEach((file) => {
    if (
        file.endsWith(".js") ||
        file.endsWith(".css") ||
        file.endsWith(".html")
    ) {
        const result = compress(fs.readFileSync(assetsDir + file), {
            mode: 1,
        });
        fs.writeFileSync(assetsDir + file + ".br", result);
    }
});
