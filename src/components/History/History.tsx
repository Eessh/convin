import { Divider, Empty, Space, Typography } from "antd";
import { useAppSelector } from "../../app/hooks";

const History: React.FC<{}> = () => {

  const history = useAppSelector(state => state.history.value);

  if (history.length === 0) {
    return <Empty />
  }

  return (
    <Space className="History" direction="vertical" size="middle" style={{ display: 'flex' }}>
    {history.map(item => {
      return <Space key={item.time} split={<Divider type="vertical" />}>
        <span>{item.cardName}</span>
        <Typography.Link>{item.link}</Typography.Link>
        <span>{item.time}</span>
      </Space>
    })}
    </Space>
  );
};

export default History;