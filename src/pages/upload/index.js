import React, { Component } from 'react';
import { serverUrl } from '~util/config';
import { Upload, Icon, Modal } from 'antd';
import { withRouter } from 'react-router-dom'; 
import classNames from 'classnames/bind';
import styles from '~less/upload.less';
// import { $get, $post } from '~util/index';
let cx = classNames.bind(styles);



class PicturesWall extends Component {
  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [{
      uid: -1,
      name: 'xxx.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    }],
  };

  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange = ({ fileList }) => this.setState({ fileList })

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={serverUrl+'/upload'}
          listType="picture-card"
          accept="image/*"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}


@withRouter
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataList: []
    };
  }
  render() {
    return (
      <div className={cx('content')}>
        <PicturesWall></PicturesWall>
      </div>
    )
  }
}

export default Main;