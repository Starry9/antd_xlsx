import './App.css';
import * as XLSX from 'xlsx';
import { message, Upload, Table } from 'antd';
import React, {Component} from "react";
import 'antd/dist/antd.min.css';
import { InboxOutlined } from '@ant-design/icons';

const { Dragger } = Upload;

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploadInfo: [],
      tableData: [], // table的数据
      tableHeader: [] // table的表头
    };
  }

  uploadFilesChange(file) {
    // 通过FileReader对象读取文件
    const fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const { result } = event.target;
        // 以二进制流方式读取得到整份excel表格对象
        const workbook = XLSX.read(result, { type: 'binary' });
        // 存储获取到的数据
        let data = {};
        // 遍历每张工作表进行读取（这里默认只读取第一张表）
        for (const sheet in workbook.Sheets) {
          let tempData = [];
          // esline-disable-next-line
          if (workbook.Sheets.hasOwnProperty(sheet)) {
            // 利用 sheet_to_json 方法将 excel 转成 json 数据
            data[sheet] = tempData.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
          }
        }
        //上传成功啦,data为上传后的数据
        console.log(data);
        const excelData = data.Sheet1;
        const excelHeader = [];
        // 获取表头
        for (const headerAttr in excelData[0]) {
          const header = {
            title: headerAttr,
            dataIndex: headerAttr,
            key: headerAttr
          };
          excelHeader.push(header);
        }
        // 解析后的变量赋值给state，重新渲染table页面
        // message.success('上传成功！')
        this.setState({
          tableData: excelData,
          tableHeader: excelHeader,
        })
        console.log(this.state)
      } catch (e) {
        // 这里可以抛出文件类型错误不正确的相关提示
        message.error('文件类型不正确！');
      }
    }
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file.file);
  }

  render() {
    return (
      <div>
        <Dragger name="file" accept={this.state.uploadInfo.suffix} beforeUpload={function () {
          return false;
        }} onChange={this.uploadFilesChange.bind(this)} showUploadList={false}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibit from uploading company data or other
            band files
          </p>
        </Dragger>
        <div>
          <Table columns={this.state.tableHeader} dataSource={this.state.tableData}/>
        </div>
      </div>
    );
  }
}

export default App;
