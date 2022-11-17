import { React } from "react";
import PropTypes from "prop-types";
import { Card, Col, Badge, Stack, Row } from "react-bootstrap";
import { truncateAddress } from "../../../utils";
import { useContractKit } from "@celo-tools/use-contractkit";
import Identicon from "../../ui/Identicon";
import { tipAnNftOwner, likeOrDislike } from "../../../utils/minter";
import { useMinterContract } from "../../../hooks/useMinterContract";
import { toast } from "react-toastify";
import { NotificationSuccess } from "../../ui/Notifications";
const NftCard = ({ nft, nftOwnerTipBalance, nftLikes }) => {
  const { image, description, owner, name, index, attributes } = nft;
  const { performActions, kit } = useContractKit();

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

  //variable for nft likes
  var allNftLikes;
  //wait till state updates and not equal to undefined
  if (nftLikes !== undefined) {
    const { totalLikes } = nftLikes;
    allNftLikes = totalLikes;
  }

  const minterContract = useMinterContract();

  const tip = async (id) => {
    try {
      await tipAnNftOwner(minterContract, performActions, id);
      toast(
        <NotificationSuccess text="Refresh browser to update NFT owner tip balance" />
      );
    } catch (error) {
      console.log(error);
    }
  };

  const likeOrDislikeNFT = async (id) => {
    try {
      await likeOrDislike(minterContract, performActions, id);
      toast(<NotificationSuccess text="Refresh browser to update NFT likes" />);
    } catch (error) {
      console.log(error);
    }
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
                  <div className="border rounded bg-light">
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

          <div>
            <Row className="mt-2">
              <Col>
                <div className="border rounded bg-light d-flex justify-content-around p-2 m-2">
                  <div className="text-secondary text-capitalize font-monospace w-35">
                    <button
                      className="font-monospace"
                      style={{
                        border: "none",
                        borderRadius: "3px",
                        fontSize: "0.9rem",
                        color: "white",
                        padding: "5px 20px",
                        background: "#F49D1A",
                        boxShadow: "rgba(20, 70, 32, .2) 0 1px 0 inset",
                      }}
                      onClick={() => likeOrDislikeNFT(index)}
                    >
                      like/dislike
                    </button>
                  </div>
                  <div className="text-secondary text-capitalize font-monospace w-35">
                    Total Likes: {allNftLikes}
                  </div>
                </div>
              </Col>
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
