import React, { useCallback, useEffect, useMemo } from "react";
import styled from "styled-components";
import useWeb3Wallet from "../../hooks/useWeb3Wallet";
import {
  EthereumWallet,
  ETHEREUM_WALLETS,
  SOLANA_WALLETS,
  Wallet,
  WALLET_TITLES,
} from "../../models/wallets";
import { ConnectorButtonProps } from "./types";
import { ConnectorButtonStatus } from "./types";
import {
  BaseButton,
  BaseLink,
  BaseModalContentColumn,
  BaseText,
  Title,
} from "shared/lib/designSystem";
import useTextAnimation from "shared/lib/hooks/useTextAnimation";
import {
  MetamaskIcon,
  WalletConnectIcon,
  WalletLinkIcon,
} from "shared/lib/assets/icons/connector";
import Indicator from "shared/lib/components/Indicator/Indicator";
import colors from "shared/lib/designSystem/colors";
import { Chains, useChain } from "../../hooks/chainContext";
import theme from "shared/lib/designSystem/theme";

const ConnectorButton = styled(BaseButton)<ConnectorButtonProps>`
  background-color: ${colors.background.three};
  align-items: center;
  width: 100%;

  &:hover {
    opacity: ${theme.hover.opacity};
  }

  ${(props) => {
    switch (props.status) {
      case "connected":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.green};
        `;
      case "neglected":
        return `
          opacity: 0.24;

          &:hover {
            opacity: 0.24;
          }
        `;
      case "initializing":
        return `
          border: ${theme.border.width} ${theme.border.style} ${colors.green};

          &:hover {
            opacity: 1;
          }
        `;
      default:
        return ``;
    }
  }}
`;

const IndicatorContainer = styled.div`
  margin-left: auto;
`;

const ConnectorButtonText = styled(Title)`
  margin-left: 16px;
`;

const LearnMoreLink = styled(BaseLink)`
  &:hover {
    opacity: ${theme.hover.opacity};
  }
`;

const LearnMoreText = styled(BaseText)`
  text-decoration: underline;
`;

const LearnMoreArrow = styled(BaseText)`
  text-decoration: none;
  margin-left: 5px;
`;

const StyledWalletLinkIcon = styled(WalletLinkIcon)`
  path.outerBackground {
    fill: #0000;
  }
`;

const ConnectWalletBody: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { activate, account, active, connectingWallet, connectedWallet } =
    useWeb3Wallet();

  const [chain] = useChain();

  const handleConnect = useCallback(
    async (wallet: Wallet) => {
      await activate(wallet);
    },
    [activate]
  );

  useEffect(() => {
    if (active && account) {
      onClose();
    }
  }, [active, account, onClose]);

  const getWalletStatus = useCallback(
    (wallet: Wallet): ConnectorButtonStatus => {
      if (connectedWallet === wallet) {
        return "connected";
      }

      if (!connectingWallet) {
        return "normal";
      } else if (connectingWallet === wallet) {
        return "initializing";
      }

      return "neglected";
    },
    [connectedWallet, connectingWallet]
  );

  const wallets: Wallet[] = useMemo(() => {
    switch (chain) {
      case Chains.Ethereum:
      case Chains.Avalanche:
        return ETHEREUM_WALLETS;
      case Chains.Solana:
        return SOLANA_WALLETS;
      case Chains.NotSelected:
      default:
        return [];
    }
  }, [chain]);

  return (
    <>
      <BaseModalContentColumn marginTop={8}>
        <Title>CONNECT WALLET</Title>
      </BaseModalContentColumn>

      {wallets.map((wallet: Wallet | string, index: number) => {
        return (
          <BaseModalContentColumn {...(index === 0 ? {} : { marginTop: 16 })}>
            <WalletButton
              wallet={wallet as Wallet}
              status={getWalletStatus(wallet as Wallet)}
              onConnect={() => handleConnect(wallet as Wallet)}
            ></WalletButton>
          </BaseModalContentColumn>
        );
      })}

      <BaseModalContentColumn marginTop={16}>
        <LearnMoreLink
          to="https://ethereum.org/en/wallets/"
          target="_blank"
          rel="noopener noreferrer"
          className="w-100"
        >
          <LearnMoreText>Learn more about wallets</LearnMoreText>
          <LearnMoreArrow>&#8594;</LearnMoreArrow>
        </LearnMoreLink>
      </BaseModalContentColumn>
    </>
  );
};

export default ConnectWalletBody;

interface WalletButtonProps {
  wallet: Wallet;
  status: ConnectorButtonStatus;
  onConnect: () => Promise<void>;
}

const WalletButton: React.FC<WalletButtonProps> = ({
  wallet,
  status,
  onConnect,
}) => {
  const initializingText = useTextAnimation(
    Boolean(status === "initializing"),
    {
      texts: [
        "INITIALIZING",
        "INITIALIZING .",
        "INITIALIZING ..",
        "INITIALIZING ...",
      ],
      interval: 250,
    }
  );

  const title = WALLET_TITLES[wallet];

  return (
    <ConnectorButton role="button" onClick={onConnect} status={status}>
      <WalletIcon wallet={wallet}></WalletIcon>
      <ConnectorButtonText>
        {status === "initializing" ? initializingText : title}
      </ConnectorButtonText>
      {status === "connected" && (
        <IndicatorContainer>
          <Indicator connected={true} />
        </IndicatorContainer>
      )}
    </ConnectorButton>
  );
};

const WalletIcon: React.FC<{ wallet: Wallet }> = ({ wallet }) => {
  switch (wallet) {
    case EthereumWallet.Metamask:
      return <MetamaskIcon height={40} width={40} />;
    case EthereumWallet.WalletConnect:
      return <WalletConnectIcon height={40} width={40} />;
    case EthereumWallet.WalletLink:
      return <StyledWalletLinkIcon height={40} width={40} />;
    default:
      return null;
  }
};