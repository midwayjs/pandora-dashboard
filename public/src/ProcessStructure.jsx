import React from 'react';
import {ApplicationPage} from "./components/ApplicationPage";
import {Tabs, Tree} from 'antd';
import {PreView} from "./components/PreView";
const { TabPane } = Tabs;
const { TreeNode } = Tree;

export class ProcessStructure extends ApplicationPage {

  renderPage () {

    return <div>

      <h3 style={{marginBottom: 10}} >Process Structures</h3>

      <Tabs defaultActiveKey="1" >
        <TabPane tab="Process Tree" key="1">

          <Tree defaultExpandAll={true} showLine >

            <TreeNode title={`[Application] ${this.appName}`} key="0-0">
              <TreeNode title="[Process] PID: 3243 /Applications/Preview.app/Contents/MacOS/Preview" key="0-0-0" >
                <TreeNode title="[Process] PID: 3243 /Applications/Preview.app/Contents/MacOS/Preview" key="0-0-0-0"  />
                <TreeNode title="[Process] PID: 3243 /Applications/Preview.app/Contents/MacOS/Preview" key="0-0-0-1" />
              </TreeNode>
              <TreeNode title="[Process] PID: 3243 /Applications/Preview.app/Contents/MacOS/Preview" key="0-0-1">
                <TreeNode title="[Process] PID: 3243 /Applications/Preview.app/Contents/MacOS/Preview" key="0-0-1-0" />
              </TreeNode>
            </TreeNode>

          </Tree>

        </TabPane>
        <TabPane tab="Static Representation" key="2">
          <PreView defaultContent={`[
    {
        "appName": "test",
        "appDir": "/Users/Allen/Works/....",
        "mode": "procfile.js",
        "process": [
            {
                "appName": "test",
                "appDir": "/Users/Allen/Works/...",
                "processName": "background",
                "entryFileBaseDir": null,
                "scale": 1,
                "env": {
                    "background": "true"
                }
            }
        ]
    }
]`} style={{minHeight: '60vh'}} />
        </TabPane>
      </Tabs>

    </div>

  }

}
