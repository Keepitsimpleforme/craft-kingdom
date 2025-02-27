import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { getEnvironment } from "../../../config/configs";

// export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
//   wallet: new PrivateKeyWallet(getEnvironment().PRIVATE_KEY),
//   domain: getEnvironment().DOMAIN,
  
// });
// console.log("Private Key:", getEnvironment().PRIVATE_KEY);
// console.log("Domain:", getEnvironment().DOMAIN);

// export default ThirdwebAuthHandler();

export const { ThirdwebAuthHandler, getUser } = ThirdwebAuth({
  wallet: new PrivateKeyWallet(getEnvironment().PRIVATE_KEY),
  domain: getEnvironment().DOMAIN,
});

console.log("ThirdwebAuth initialized with domain:", getEnvironment().DOMAIN);

export default ThirdwebAuthHandler();

const env = getEnvironment();

console.log("🔍 Loaded Environment Variables:");
console.log(env);

if (!env.NEXT_PUBLIC_TEMPLATE_CLIENT_ID) {
  console.error("❌ Missing NEXT_PUBLIC_TEMPLATE_CLIENT_ID. Check .env.local.");
}