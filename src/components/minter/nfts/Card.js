import { React, useState } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Row } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import { useContractKit } from "@celo-tools/use-contractkit";
import Identicon from "../../ui/Identicon";
import { tipAnNftOwner } from "../../../utils/minter";
import { useMinterContract } from "../../../hooks/useMinterContract";
const NftCard = ({ nft, nftOwnerTipBalance }) => {
  const { image, description, owner, name, index, attributes } = nft;
  const { performActions, address, kit } = useContractKit();

  //function to format nft owner tipped balance
  const formatWei = (wei) => {
    let bal = kit.web3.utils.fromWei(wei);
    return bal;
  };
  //variable for nft owner tipped amount
  var tipBal;
  //wait till state updates and not equal to undefined
  if (nftOwnerTipBalance !== undefined) {
    const { nftOwner, ownerBal } = nftOwnerTipBalance;
    const newOwnerBal = formatWei(ownerBal);
    tipBal = newOwnerBal;
  }
  const minterContract = useMinterContract();

  const tip = (id) => {
    tipAnNftOwner(minterContract, performActions, id);
  };
  return (
    <Col key={index}>
      <Card className=" h-100">
        <Card.Header>
          <Stack direction="horizontal" gap={2}>
            <Identicon address={owner} size={28} />
            <span className="font-monospace text-secondary">
              {truncateAddress(owner)}
            </span>
            <Badge bg="secondary" className="ms-auto">
              {index} ID
            </Badge>
          </Stack>
        </Card.Header>

        <div className=" ratio ratio-4x3">
          <img src={image} alt={description} style={{ objectFit: "cover" }} />
        </div>

        <Card.Body className="d-flex  flex-column text-center">
          <Card.Title>{name}</Card.Title>
          <Card.Text className="flex-grow-1">{description}</Card.Text>

          <Card.Text
            className="flex-grow-1 font-monospace rounded bg-light"
            style={{
              border: "1px solid rgba(51, 51, 51, 0.05)",
              color: "green",
            }}
          >
            tipped balance: {tipBal} CELO
          </Card.Text>

          <div>
            <Row className="mt-2">
              {attributes.map((attribute, key) => (
                <Col key={key}>
                  <div className="bordyer rounded bg-light">
                    <div className="text-secondary fw-lighter small text-capitalize">
                      {attribute.trait_type}
                    </div>
                    <div className="text-secondary text-capitalize font-monospace">
                      {attribute.value}
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
          <button
            className="font-monospace"
            style={{
              border: "none",
              borderRadius: "3px",
              fontSize: "0.9rem",
              color: "white",
              width: "40%",
              marginTop: "10px",
              margin: "0 auto",
              padding: "5px 20px",
              background: "#298e46",
              boxShadow: "rgba(20, 70, 32, .2) 0 1px 0 inset",
            }}
            onClick={() => tip(index)}
          >
            tip owner
          </button>
        </Card.Body>
      </Card>
    </Col>
  );
};

NftCard.propTypes = {
  // props passed into this component
  nft: PropTypes.instanceOf(Object).isRequired,
};

export default NftCard;
