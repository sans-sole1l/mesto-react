import React from 'react';
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext'
import { FormSubmitStateContext } from '../contexts/FormSubmitStateContext';
import { useForm } from "react-hook-form";


function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const currentUser = React.useContext(CurrentUserContext);
  const formSubmitState = React.useContext(FormSubmitStateContext);

  const { register, handleSubmit, errors } = useForm({mode: 'onChange'});

  const [name, setName] = React.useState('');
  const [description, setDescription] = React.useState('');

  // После загрузки текущего пользователя из API
  // его данные будут использованы в управляемых компонентах.
  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser]); 
 
  function handleNameChange(evt) {
    setName(evt.target.value)
  }

  function handleDescriptionChange(evt) {
    setDescription(evt.target.value)
  }

  function onSubmit(data) {
    formSubmitState.setState(true);

    // Передаём значения управляемых компонентов во внешний обработчик
    onUpdateUser({
      name,
      about: description,
    });
  }

  return (
    <PopupWithForm 
      title='Редактировать профиль' 
      name='edit-profile' 
      modalState={isOpen ? 'modal_opened' : ''} 
      onClose={onClose}
      children={
      <form action="#" name="edit-profile" className="modal__form modal__form_type_profile" onSubmit={handleSubmit(onSubmit)}>
        <input 
          id="name-input" 
          name="name" 
          type="text" 
          className={errors.name ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={name} 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 2, message: 'Текст должен содержать не менее 2 симв.'}, 
            maxLength: 40, 
          })}
          onChange={handleNameChange} 
          placeholder="Имя" 
          autoComplete="off"
        />

        <span 
          id="name-input-error" 
          className={errors.name ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {errors.name && errors.name.message}
        </span>

        <input 
          id="character-input" 
          name="about" 
          type="text" 
          className={errors.about ? "modal__input modal__input_type_error" : "modal__input"}
          defaultValue={description} 
          ref={register({ 
            required: {value: true, message: 'Заполните это поле'}, 
            minLength: {value: 2, message: 'Текст должен содержать не менее 2 симв.'}, 
            maxLength: 200, 
          })}
          onChange={handleDescriptionChange} 
          placeholder="Занятие"
          autoComplete="off"
        />

        <span 
          id="character-input-error" 
          className={errors.about ? "modal__input-error modal__input-error_active" : "modal__input-error"}
        >
          {errors.about && errors.about.message}
        </span>

        <button 
          type="submit" 
          className={(errors.name || errors.about) ? "modal__save-button modal__save-button_inactive" : "modal__save-button"} 
          disabled={(errors.name || errors.about) && true}
        >
          {formSubmitState.state ? 'Сохранение...' : 'Сохранить'}
        </button>
      </form>
    }/>
  );
}

export default EditProfilePopup;
