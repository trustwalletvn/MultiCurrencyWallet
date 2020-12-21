import React from 'react'
import CSSModules from 'react-css-modules'
import moment from 'moment-with-locales-es6'
import styles from './Comment.scss'
import { FormattedMessage } from 'react-intl'

import actions from 'redux/actions'


interface IWithdrawModalProps {
  commentKey?: any,
  isOpen?: boolean,
  label?: string,
  date?: any,
  canEdit?: boolean,
  showComment?: boolean,
  updateComment?: (text: string) => void,
  onSubmit?: (text: string) => void
}

interface IWithdrawModalState {
  comment?: null | string,
  isOpen?: boolean
}


@CSSModules(styles, { allowMultiple: true })

export default class CommentRow extends React.PureComponent<any, any> {


  props: IWithdrawModalProps
  state: IWithdrawModalState

  commentTextarea: any

  constructor(props) {
    super(props)
    this.commentTextarea = React.createRef()
    this.state = {
      isOpen: false,
      comment: null
    }
  }

  submitComment = (e, props) => {

    if (e) {
      e.preventDefault()
    }
    const {
      commentKey,
      updateComment = false
    } = this.props

    const {
      comment
    } = this.state


    actions.comments.setComment({
      key:commentKey,
      comment:comment
    })

    if(updateComment) {
      updateComment(comment);
    }

    const {
      label,
      date,
      canEdit = false,
      showComment = false,
    } = this.props

    this.toggleComment()
  }
  componentDidMount() {

    const {
      commentKey
    } = this.props

    // not need anymore
    // actions.core.getSwapHistory()
    const comment = actions.comments.getComment(commentKey)

    if(comment) {
      this.setState({
        comment
      })
    }

  }
  componentDidUpdate(prevProps) {

    if (this.props.isOpen && this.props.isOpen !== prevProps.isOpen && this.props.onSubmit) {
      this.handleKeyUp();
    }
  }

  handleKeyUp = (e = null) => {
    if (!this.commentTextarea) {

      return
    }

    if (e && e.ctrlKey && e.keyCode == 13) {

      this.submitComment(null, this.props)
      return
    }

    this.commentTextarea
      .current.style.cssText = 'height:' + this.commentTextarea.current.scrollHeight + 'px;'
  }

  changeComment = (event) => this.setState({comment: event.target.value});

  toggleComment = () => {
    const {isOpen = false} = this.state
    this.setState({isOpen: !isOpen})
  }

  render() {
    const {
      label,
      date,
      canEdit = false,
      showComment = false,
      } = this.props

    const { isOpen = false, comment = null } = this.state

    return (
      <div styleName="wrap-block">
        {canEdit && (isOpen ?
          <form styleName="input" onSubmit={(e) => this.submitComment(e, this.props)}>
            <textarea ref={this.commentTextarea}
                      styleName="commentTextarea" id="commentTextarea"
                      onKeyUp={this.handleKeyUp}
                      onChange={this.changeComment}
                      value={comment} ></textarea>
            <span styleName="submit" onClick={(e) => this.submitComment(e, this.props)}>&#10004;</span>
            <span styleName="close" onClick={() => this.toggleComment()}>&times;</span>
          </form> :
          <div styleName="add-link" onClick={() => this.toggleComment()}>
            <FormattedMessage id="add_notice" defaultMessage="Add notice" />
          </div>)}
        {showComment && (
          <div styleName="date">
            {date && (<div>{moment(date).format('LLLL')}</div>) }
            {comment && (<div>{comment}</div>)}
          </div>
        )}
    </div>)
  }
}
