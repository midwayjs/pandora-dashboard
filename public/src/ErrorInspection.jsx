import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Card, Tag, Pagination} from 'antd';

export class ErrorInspection extends ApplicationPage {

  renderPage () {
    return <div>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <SingleMsg/>
      <div style={{marginTop: 30, textAlign: 'center'}} >
        <Pagination defaultCurrent={1} total={500} />
      </div>
    </div>
  }

}

const SingleMsg = () => {

  const title = <div style={{fontSize: 12, marginBottom: 10}} >
    <Tag color="pink">Error</Tag> November 28th 2017, 7:27:47 pm
  </div>;

  return (
    <Card bodyStyle={{padding: '15px 20px'}} style={{marginBottom: 15, borderColor: '#ddd', borderRadius: 0}} >
      {title}
      <p><b style={{marginRight: 10}} >Error Message: </b><span>{'react-lazy-load@3.0.12 requires a peer of react-dom@^0.14.0 || ^15.0.0-0 but none was installed.'}</span></p>
    </Card>
  )
};

