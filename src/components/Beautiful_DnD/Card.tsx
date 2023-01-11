import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { TCard } from ".";
import { removeCardThunk, selectBuckets } from "./BucketsSlice";
import { Button, Modal, Typography } from "antd";
import "./Card.css";
import YoutubeEmbed from "../YoutubeEmbed";
import { addHistory } from "../History/HistorySlice";
import moment from "moment";

const getYoutubeVideoId = (url: string): string | null => {
  const results = url.match('[\\?&]v=([^&#]*)');
  return results === null ? null : results[1];
};

const getYoutubeThumbnail = (url: string): string => {
  const videoId = getYoutubeVideoId(url);
  return 'http://img.youtube.com/vi/' + videoId + '/0.jpg';
};

const Card: React.FC<{
  card: TCard
  cardIndex: number,
  bucketIndex: number
}> = ({ card, cardIndex, bucketIndex }) => {

  const appDispatch = useAppDispatch();
  const buckets = useAppSelector(selectBuckets);
  const [mv, setMv] = useState<boolean>(false);
  const [removeCardModalVisible, setRemoveCardModalVisible] = useState<boolean>(false);
  const [removeCardModalConforming, setRemovCardModalConforming] = useState<boolean>(false);

  return (
    <div className="Card">
      <span className="Card__name">{card.name}</span>
      <Typography.Link className="Card__link" onClick={() => {
        setMv(true);
        appDispatch(addHistory({ cardName: card.name, link: card.link, time: moment().format("MMMM Do YYYY, h:mm:ss a") }));
      }}>{card.link}</Typography.Link>
      <img src={getYoutubeThumbnail(card.link)} style={{
        borderRadius: "0.5rem",
        marginBottom: "0.5rem",
      }} alt="thumbnail" />
      <Button type="primary" danger onClick={() => setRemoveCardModalVisible(true)}>Delete</Button>
      <Modal
        title="Confirm"
        open={removeCardModalVisible}
        confirmLoading={removeCardModalConforming}
        okText="Remove"
        okButtonProps={{
          type: "primary",
          danger: true
        }}
        onOk={() => {
          setRemovCardModalConforming(true);
          appDispatch(removeCardThunk({buckets, bucketIndex, cardIndex}));
          setRemovCardModalConforming(false);
        }}
        onCancel={() => setRemoveCardModalVisible(false)}
        destroyOnClose
      >
        Are you sure, wanna remove card: <strong>{card.name}</strong> ?
      </Modal>
      <Modal
        open={mv}
        footer={null}
        onCancel={() => setMv(false)}
        destroyOnClose
        width={720}
      >
        <YoutubeEmbed videoId={getYoutubeVideoId(card.link)!} />
      </Modal>
    </div>
  );
};

export default Card;