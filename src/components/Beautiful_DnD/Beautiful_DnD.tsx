import { useEffect, useState } from "react";
import { DragDropContext, DropResult, ResponderProvided } from "react-beautiful-dnd";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import Bucket from "./Bucket";
import { Button, Modal, Form, Input } from "antd";
import { PlusCircleFilled } from "@ant-design/icons";
import "./Beautiful_DnD.css";
import { addBucketThunk, fetchBucketsThunk, reorderThunk } from "./BucketsSlice";

const Beautiful_DnD: React.FC<{}> = () => {

  const appDispatch = useAppDispatch();
  const buckets = useAppSelector((state) => state.buckets.buckets);
  const [newBucketModalVisible, setNewBucketModalVisible] = useState<boolean>(false);
  const [conforming, setConforming] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    appDispatch(fetchBucketsThunk());
  }, []);

  const handleDragEnd = (result: DropResult, provided: ResponderProvided) => {
    const { draggableId, source, destination } = result;
    if (!destination) {
      return;
    }
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return;
    }
    let sourceBucketIndex: number = 0, destinationBucketIndex: number = 0;
    for (let i=0; i<buckets.length; i++) {
      if (buckets[i].id === source.droppableId) {
        sourceBucketIndex = i;
      }
      if (buckets[i].id === destination.droppableId) {
        destinationBucketIndex = i;
      }
    }
    appDispatch(reorderThunk({
      buckets,
      sourceBucketIndex,
      destinationBucketIndex,
      sourceCardIndex: source.index,
      destinationCardIndex: destination.index
    }));
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="Beautiful_DnD" style={{
        display: "flex",
        flexDirection: "row"
      }}>
        {buckets.map((bucket, bucketIndex) => {
          return <Bucket bucket={bucket} bucketIndex={bucketIndex} key={bucketIndex} />
        })}
        <Button type="primary" onClick={() => setNewBucketModalVisible(true)}><PlusCircleFilled /> New Bucket</Button>
        <Modal
          title="New Bucket"
          open={newBucketModalVisible}
          confirmLoading={conforming}
          okText="Create Bucket"
          onOk={() => {
            setConforming(true);
            form
            .validateFields()
            .then((values: { bucketname: string }) => {
              form.resetFields();
              appDispatch(addBucketThunk({ buckets, bucketName: values.bucketname }));
              setConforming(false);
              setNewBucketModalVisible(false);
            })
            .catch((info) => {
              setConforming(false);
              console.log("Form Validate Failed: ", info)
            });
          }}
          onCancel={() => setNewBucketModalVisible(false)}
        >
          <Form
            form={form}
            initialValues={{ remember: true }}
            autoComplete="off"
          >
            <Form.Item
              label="Bucket Name"
              name="bucketname"
              rules={[{ required: true, message: "Please input bucket name!" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </DragDropContext>
  );
};

export default Beautiful_DnD;