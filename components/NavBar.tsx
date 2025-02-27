import {
  ConnectWallet,
  useAddress,
  useContract,
  useContractRead,
  useShowConnectEmbed,
  useTokenBalance,
  useUser,
  useWallet,
} from "@thirdweb-dev/react";
import React, { useEffect, useState } from "react";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { buildingsIds, STAKING_CONTRACT_ADDRESS, TOKEN_CONTRACT_ADDRESS } from "../constants/contracts";
import { useRouter } from "next/router";
import { FaMap, FaBalanceScale } from "react-icons/fa";
import { MdHome, MdMoney, MdShield } from "react-icons/md";
import { BigNumber } from "ethers";

const NavBar = () => {
  const address = useAddress();
  const showConnectEmbed = useShowConnectEmbed();
  const { contract: tokenContract } = useContract(TOKEN_CONTRACT_ADDRESS);
  const { data: tokenBalance } = useTokenBalance(tokenContract, address);
  const { contract: stakingContract } = useContract(STAKING_CONTRACT_ADDRESS);
  const { data: stakedTokens } = useContractRead(stakingContract, "getStakeInfo", [address]);
  const { isLoggedIn, isLoading } = useUser();
  const router = useRouter();
  const wallet = useWallet(); // Get wallet instance
  const [showBuildingsMenu, setShowBuildingsMenu] = useState(false);
  const [hasTavern, setHasTavern] = useState(false);
  const [selectedWallet, setSelectedWallet] = useState<"embedded" | null>(null);

  // Display balance utility
  const _displayBalance = (num: string) => num.slice(0, 4);

  // Check if user owns a Tavern
  const checkOwnedTavern = () => {
    if (stakedTokens && stakedTokens[0]?.length > 0) {
      setHasTavern(stakedTokens[0].some((token: BigNumber) => token.toNumber() === buildingsIds.Tavern));
    }
  };

  // Redirect to login if not logged in
  useEffect(() => {
    if (!isLoggedIn && !isLoading) {
      router.push("/login");
    }
  }, [isLoggedIn, isLoading, router]);

  // Prevent Auto-Connect to Smart Account (By controlling the Embedded Wallet behavior)
  useEffect(() => {
    if (showConnectEmbed) {
      setSelectedWallet(null); // Prevent auto-login
    }
  }, [showConnectEmbed]);

  // Update Tavern ownership on data change
  useEffect(() => {
    checkOwnedTavern();
  }, [stakedTokens]);

  // Connect to Embedded Wallet when button is clicked
  const handleConnectWallet = async () => {
    if (!address) {
      setSelectedWallet("embedded");
      await wallet.connect("embedded");
    }
  };

  // Determine which wallet address to show
  const displayedAddress = address && selectedWallet ? address : null;

  return (
    <div className={styles.full_with}>
      {isLoggedIn && (
        <div className={styles.navbarContainer}>
          <Link href="/">
            <div className={styles.navbar_header}>
              <img src="/images/logo.png" alt="" />
              <div className={styles.logo}>
                <span>CRAFTING</span>
                <span>KINGDOMS</span>
              </div>
            </div>
          </Link>

          {/* NAVIGATION LINKS */}
          <div className={styles.navbarOptions}>
            <Link href="/world_map">
              <span className={styles.navbar_links}>
                <FaMap />
                World Map
              </span>
            </Link>

            {/* BUILDINGS DROPDOWN */}
            <div
              id="buildingsLink"
              tabIndex={2}
              onMouseOver={() => setShowBuildingsMenu(true)}
            >
              <span className={styles.navbar_links}>
                <MdHome /> Buildings
              </span>
              {showBuildingsMenu && (
                <div
                  tabIndex={3}
                  className=""
                  onMouseEnter={(e) => e.currentTarget.focus()}
                  onMouseLeave={() => setShowBuildingsMenu(false)}
                >
                  <Link href="/realm_workshops">
                    <span className={styles.navbar_links}>
                      <MdMoney /> Economic Buildings
                    </span>
                  </Link>
                  <Link href="/realm_military">
                    <span className={styles.navbar_links}>
                      <MdShield /> Military Buildings
                    </span>
                  </Link>
                </div>
              )}
            </div>

            {hasTavern && (
              <Link href="/realm_marketplace">
                <span className={styles.navbar_links}>
                  <FaBalanceScale /> Tavern
                </span>
              </Link>
            )}

            <Link href="/realm_marketplace">
              <span className={styles.navbar_links}>
                <FaBalanceScale /> Marketplace
              </span>
            </Link>
          </div>

          {/* WALLET SECTION */}
          <div className={styles.navbarOptions}>
            {tokenBalance && (
              <p>
                {_displayBalance(tokenBalance.displayValue as string)}
                <div>
                  <img src="/images/coin.png" alt="" />
                  {tokenBalance.symbol}
                </div>
              </p>
            )}

            {/* CONNECT WALLET BUTTON */}
            {!address ? (
              <button
                className="web3_component"
                onClick={handleConnectWallet}
              >
                Connect Wallet
              </button>
            ) : (
              <ConnectWallet
                className="web3_component"
                btnTitle={
                  displayedAddress
                    ? `${displayedAddress.slice(0, 6)}...${displayedAddress.slice(-4)}`
                    : "Connect Wallet"
                }
                auth={{ loginOptional: true }} // Ensures embedded login is not forced
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;