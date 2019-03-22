import React, { createRef, Component } from 'react';
import { storiesOf } from '@storybook/react';

import { Box, Button, Grommet, Keyboard, Text, TextInput } from 'grommet';
import { grommet } from 'grommet/themes';
import { FormClose } from 'grommet-icons';

const aliasesSuggestions = ['sony', 'sonar', 'foo', 'bar'];

const Tag = ({ children, onRemove, ...rest }) => {
  const tag = (
    <Box
      direction="row"
      align="center"
      background="brand"
      pad={{ horizontal: 'xsmall', vertical: 'xxsmall' }}
      margin={{ vertical: 'xxsmall' }}
      round="medium"
      {...rest}
    >
      <Text size="xsmall" margin={{ right: 'xxsmall' }}>
        {children}
      </Text>
      {onRemove && <FormClose size="small" color="white" />}
    </Box>
  );

  if (onRemove) {
    return <Button onClick={onRemove}>{tag}</Button>;
  }
  return tag;
};

class TagInput extends Component {
  state = {
    currentTag: '',
  };

  boxRef = createRef();

  componentDidMount() {
    this.forceUpdate();
  }

  updateCurrentTag = event => this.setState({ currentTag: event.target.value });

  onAddTag = tag => {
    const { onAdd } = this.props;
    if (onAdd) {
      onAdd(tag);
    }
  };

  onEnter = () => {
    const { currentTag } = this.state;
    if (currentTag.length) {
      this.onAddTag(currentTag);
      this.setState({ currentTag: '' });
    }
  };

  renderValue = () => {
    const { value, onRemove } = this.props;
    return value.map((v, index) => (
      <Tag margin="xxsmall" key={`${v}${index}`} onRemove={() => onRemove(v)}>
        {v}
      </Tag>
    ));
  };

  render() {
    const { value = [], onAdd, onRemove, onChange, ...rest } = this.props;
    const { currentTag } = this.state;
    return (
      <Keyboard onEnter={this.onEnter}>
        <Box
          direction="row"
          align="center"
          pad={{ horizontal: 'xsmall' }}
          border="all"
          ref={this.boxRef}
          wrap
        >
          {value.length > 0 && this.renderValue()}
          <Box flex style={{ minWidth: '120px' }}>
            <TextInput
              type="search"
              plain
              dropTarget={this.boxRef.current}
              {...rest}
              onChange={this.updateCurrentTag}
              value={currentTag}
              onSelect={event => {
                event.stopPropagation();
                this.onAddTag(event.suggestion);
              }}
            />
          </Box>
        </Box>
      </Keyboard>
    );
  }
}

class TagTextInput extends Component {
  state = {
    selectedTags: ['foo', 'sony'],
  };

  onRemoveTag = tag => {
    const { selectedTags } = this.state;

    const removeIndex = selectedTags.indexOf(tag);

    const newTags = [...selectedTags];
    if (removeIndex >= 0) {
      newTags.splice(removeIndex, 1);
    }
    this.setState({
      selectedTags: newTags,
    });
  };

  onAddTag = tag => {
    const { selectedTags } = this.state;
    this.setState({
      selectedTags: [...selectedTags, tag],
    });
  };

  render() {
    const { selectedTags } = this.state;
    return (
      <Grommet full theme={grommet}>
        <Box pad="small">
          <TagInput
            placeholder="Search for aliases..."
            suggestions={aliasesSuggestions}
            value={selectedTags}
            onRemove={this.onRemoveTag}
            onAdd={this.onAddTag}
          />
        </Box>
      </Grommet>
    );
  }
}

storiesOf('TextInput', module).add('Tag TextInput', () => <TagTextInput />);
