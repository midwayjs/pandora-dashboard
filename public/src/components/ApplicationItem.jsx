import React, { Component } from 'react';
import {Card} from 'antd';
import IconDvr from 'react-icons/lib/md/dvr';
import IconMap from 'react-icons/lib/md/map';
import IconTraffic from 'react-icons/lib/md/traffic';
import IconHighlight from 'react-icons/lib/md/highlight';
import IconStraighten from 'react-icons/lib/md/straighten';
import { Link } from 'react-router-dom';


export class ApplicationItem extends Component {

  render () {

    const title = <div style={{fontWeight: 'normal', fontSize: 12, paddingLeft: 5, paddingBottom: 15, marginBottom: 10, borderBottom: '1px solid #ddd'}} >
      <div>
        <h4 style={{fontWeight: 'bold', fontSize: 16, display: 'inline'}} >pandora-dashboard [Started]</h4>
        <span style={{marginLeft: 10}} >At location /home/allen/project/midway-sandbox</span>
      </div>

      <div style={{marginTop: 5}} >
        <p>
          <span style={styles.titleIndicator} >
            <b>Uptime:</b> 3 days 5 hours 3 minutes
          </span>
          <span style={styles.titleIndicator} >
            <b>PID:</b> 3333, 4444
          </span>
          <span style={styles.titleIndicator} >
            <b>Restart Count:</b> 0 times
          </span>
        </p>
      </div>

    </div>;

    return <Card bodyStyle={{padding: 15}} style={{marginBottom: 30, borderColor: '#ddd', borderRadius: 0}} >
        {title}

        <div>

          <Link to="/application/pandora-dashboard/stdout">
            <div style={styles.actionIcon} className="actionIcon" >
              <IconDvr size={32}/>
              <br/>
              <span style={styles.actionIconText} >Stdout</span>
            </div>
          </Link>

          <Link to="/application/pandora-dashboard/processStructures">
            <div style={styles.actionIcon} className="actionIcon" >
              <IconMap size={32}/>
              <br/>
              <span style={styles.actionIconText} >Process Structures</span>
            </div>
          </Link>

          <div style={styles.actionSplitter} ></div>

          <Link to="/application/pandora-dashboard/errorInspection">
            <div style={styles.actionIcon} className="actionIcon" >
              <IconTraffic size={32}/>
              <br/>
              <span style={styles.actionIconText} >Error Inspection</span>
            </div>
          </Link>

          <Link to="/application/pandora-dashboard/metrics">
            <div style={styles.actionIcon} className="actionIcon" >
              <IconStraighten size={32}/>
              <br/>
              <span style={styles.actionIconText} >Metrics</span>
            </div>
          </Link>

          <Link to="/application/pandora-dashboard/trace">
            <div style={styles.actionIcon} className="actionIcon" >
              <IconHighlight size={32}/>
              <br/>
              <span style={styles.actionIconText} >Trace</span>
            </div>
          </Link>

        </div>

      </Card>

  }

}


const styles = {
  titleIndicator: {
    marginRight: 10
  },
  actionIcon: {
    cursor: "pointer",
    verticalAlign: 'top',
    width: 60,
    padding: '5px 10px',
    boxSizing: 'content-box',
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: 1.2
  },
  actionIconText: {
    display: 'inline-block',
    paddingTop: 5
  },
  actionSplitter: {
    display: 'inline-block',
    height: 75,
    margin: '0 15px',
    width: 1,
    overflow: 'hidden',
    background: '#ddd'

  }
};
