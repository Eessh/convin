import './App.css';
import Beautiful_DnD from './components/Beautiful_DnD';
import History from './components/History';
import { Button, Modal } from 'antd';
import { useState } from 'react';

function App() {

  const [historyModalVisible, setHistoryModalVisible] = useState<boolean>(false);

  return (
    <div className="App">
      <Beautiful_DnD />
      <Button
        type="primary"
        style={{
          position: "fixed",
          bottom: "1rem",
          right: "1rem"
        }}
        onClick={() =>setHistoryModalVisible(true)}
      >History</Button>
      <Modal
        title="History"
        open={historyModalVisible}
        footer={null}
        onCancel={() => setHistoryModalVisible(false)}
      >
        <History />
      </Modal>
    </div>
  );
}

export default App;
