import React, { useState, useCallback } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';

const EditNow = ({
  initialValue,
  onSave,
  label = null,
  placeholder = 'Write your value',
  emptyMsg = 'Input is empty',
  wrapperClassName = '',
  ...inputProps
}) => {
  // internal state
  const [input, setInput] = useState(initialValue);
  const [isEditable, setIsEditable] = useState(false);

  // for the RSuite, we don't need to pass `e.target.value`
  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onEditClick = useCallback(() => {
    setIsEditable(p => !p); // reverse boolean
    setInput(initialValue); // set to initial value
  }, [initialValue]);

  const onSaveClick = async () => {
    const trimmed = input.trim();
    if (trimmed === '') {
      Alert.info(emptyMsg, 4000);
    }

    if (trimmed !== initialValue) {
      await onSave(trimmed); // dashboard
    }
    setIsEditable(false);
  };

  return (
    <div className={wrapperClassName}>
      {label}
      <InputGroup className="w-e" >
        <Input
          {...inputProps}
          disabled={!isEditable}
          placeholder={placeholder}
          onChange={onInputChange}
          value={input}
        />

        <InputGroup.Button onClick={onEditClick}>
          {/* edit2 is an icon */}
          <Icon icon={isEditable ? 'close' : 'edit2'} />
        </InputGroup.Button>

        {isEditable && (
          <InputGroup.Button onClick={onSaveClick}>
            <Icon icon="check" />
          </InputGroup.Button>
        )}
      </InputGroup>
    </div>
  );
};

export default EditNow;
