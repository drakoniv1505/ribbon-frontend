import React, { useCallback } from "react";
import { useWeb3Wallet } from "../../hooks/useWeb3Wallet";
import styled from "styled-components";

import BasicModal from "shared/lib/components/Common/BasicModal";
import { getAssetColor, getAssetLogo } from "shared/lib/utils/asset";
import { Title, Subtitle, BaseIndicator } from "shared/lib/designSystem";
import { CHAINID, ENABLED_CHAINID } from "shared/lib/utils/env";
import {
  CHAINID_TO_NATIVE_TOKENS,
  READABLE_NETWORK_NAMES,
} from "shared/lib/constants/constants";
import { switchChains } from "shared/lib/utils/chainSwitching";
import useScreenSize from "shared/lib/hooks/useScreenSize";
import sizes from "shared/lib/designSystem/sizes";

interface ConnectChainBodyProps {
  onClose: () => void;
}

const ModalContainer = styled.div`
  padding: 10px 16px;
`;

const NetworkContainer = styled.div<{
  borderColor: string;
  active?: boolean;
}>`
  display: flex;
  border-radius: 8px;
  padding: 12px 16px;
  align-items: center;
  justify-content: space-between;
  background: #212127;
  box-sizing: border-box;
  border-radius: 8px;
  margin-bottom: 16px;
  cursor: pointer;

  ${(props) =>
    props.active
      ? `border: 1px solid ${props.borderColor};`
      : "border: 1px solid #212127;"}
`;
const NetworkNameContainer = styled.div`
  display: flex;
  align-items: center;
`;
const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
`;
const NetworkName = styled(Subtitle)`
  font-size: 16px;
  text-transform: uppercase;
  line-height: 24px;
  margin-left: 10px;
`;
const AssetCircle = styled(BaseIndicator)<{
  size: number;
  color: string;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 5px;
`;

const ConnectChainBody: React.FC<ConnectChainBodyProps> = ({ onClose }) => {
  const { chainId: currentChainId } = useWeb3Wallet();
  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);
  const { ethereumProvider } = useWeb3Wallet();
  const isMobile = useScreenSize().width <= sizes.md;

  const handleSwitchChain = useCallback(
    async (chainId: number) => {
      if (ethereumProvider && currentChainId !== chainId) {
        await switchChains(ethereumProvider, chainId);

        // Give it a delay before closing, if not it will show a flash
        setTimeout(() => {
          handleClose();
          // Mobile wallets normally need to do a hard refresh
          if (isMobile) {
            window.location.replace("/");
          }
        }, 300);
      }
    },
    [ethereumProvider, currentChainId, handleClose, isMobile]
  );

  return (
    <ModalContainer>
      <TitleContainer>
        <Title>Select a blockchain</Title>
      </TitleContainer>

      {ENABLED_CHAINID.map((chainId: CHAINID) => {
        const Logo = getAssetLogo(CHAINID_TO_NATIVE_TOKENS[chainId]);
        const color = getAssetColor(CHAINID_TO_NATIVE_TOKENS[chainId]);
        const active = currentChainId === chainId;

        return (
          <NetworkContainer
            key={chainId}
            onClick={() => handleSwitchChain(chainId)}
            borderColor={color}
            active={active}
          >
            <NetworkNameContainer>
              <AssetCircle size={40} color={`${color}1F`}>
                <Logo height={28} width={28}></Logo>
              </AssetCircle>
              <NetworkName>{READABLE_NETWORK_NAMES[chainId]}</NetworkName>
            </NetworkNameContainer>

            {active && <BaseIndicator size={8} color={color}></BaseIndicator>}
          </NetworkContainer>
        );
      })}
    </ModalContainer>
  );
};

export default ConnectChainBody;