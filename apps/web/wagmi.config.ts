import { defineConfig } from "@wagmi/cli";
import { erc } from "@wagmi/cli/plugins";
import hardhatDeploy from "@sunodo/wagmi-plugin-hardhat-deploy";

export default defineConfig({
    out: "src/contracts.ts",
    plugins: [
        hardhatDeploy({
            directory: "node_modules/@cartesi/rollups/export/abi",
        }),
        erc(),
    ],
});
