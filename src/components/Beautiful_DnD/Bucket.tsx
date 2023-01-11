import { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import Card from "./Card";
import { TBucket } from ".";
import { addCardThunk, removeBucketThunk, selectBuckets } from "./BucketsSlice";
import { Button, Space, Modal, Form, Input } from "antd";
import "./Bucket.css";
import { DeleteFilled, PlusCircleFilled } from "@ant-design/icons";

const Bucket: React.FC<{
  bucket: TBucket,
  bucketIndex: number
}> = ({ bucket, bucketIndex }) => {

  const buckets = useAppSelector(selectBuckets);
  const appDispatch = useAppDispatch();
  const [newCardModalVisible, setNewCardModalVisible] = useState<boolean>(false);
  const [newCardModalConforming, setNewCardModalConforming] = useState<boolean>(false);
  const [removeBucketModalVisible, setRemoveBucketModalVisible] = useState<boolean>(false);
  const [removeBucketModalConforming, setRemoveBucketModalConforming] = useState<boolean>(false);
  const [form] = Form.useForm();

  return (
    <div className="Bucket">
      <div style={{
        width: "100%",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingLeft: "0.5rem",
        paddingRight: "0.5rem"
      }}>
        <h3>{bucket.name}</h3>
        <Space wrap align="center">
          <Button type="primary" onClick={() => setNewCardModalVisible(true)}><PlusCircleFilled /></Button>
          <Modal
            title="New Card"
            open={newCardModalVisible}
            confirmLoading={newCardModalConforming}
            okText="Create Card"
            onOk={() => {
              setNewCardModalConforming(true);
              form
              .validateFields()
              .then((values: { cardname: string, link: string }) => {
                form.resetFields();
                appDispatch(addCardThunk({ buckets, bucketIndex, cardName: values.cardname, cardLink: values.link }));
                setNewCardModalConforming(false);
                setNewCardModalVisible(false);
              })
              .catch((info) => {
                setNewCardModalConforming(false);
                console.log("Form Validate Failed: ", info);
              })
            }}
            onCancel={() => setNewCardModalVisible(false)}
            destroyOnClose
          >
            <Form
              form={form}
              initialValues={{ remember: true }}
              autoComplete="off"
            >
              <Form.Item
                label="Card Name"
                name="cardname"
                rules={[{ required: true, message: "Please input card name!" }]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label="Video Link"
                name="link"
                rules={[{ required: true, message: "Please input video link!" }]}
              >
                <Input />
              </Form.Item>
            </Form>
          </Modal>
          <Button type="primary" danger onClick={() => setRemoveBucketModalVisible(true)}><DeleteFilled /></Button>
          <Modal
            title="Confirm"
            open={removeBucketModalVisible}
            confirmLoading={removeBucketModalConforming}
            okText="Remove"
            okButtonProps={{
              type: "primary",
              danger: true
            }}
            onOk={() => {
              setRemoveBucketModalConforming(true);
              appDispatch(removeBucketThunk({ buckets, bucketIndex }))
              setRemoveBucketModalConforming(false);
              setRemoveBucketModalVisible(false);
            }}
            onCancel={() => setRemoveBucketModalVisible(false)}
          >
            Are you sure, wanna remove bucket: <strong>{bucket.name}</strong> ?
          </Modal>
        </Space>
      </div>
      <Droppable droppableId={bucket.id}>
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {bucket.cards.map((card, cardIndex) => {
              return <Draggable
                key={cardIndex}
                draggableId={card.id}
                index={cardIndex}
              >
                {(provided) => (
                  <div
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    <Card card={card} cardIndex={cardIndex} bucketIndex={bucketIndex} />
                  </div>
                )}
              </Draggable>
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default Bucket;