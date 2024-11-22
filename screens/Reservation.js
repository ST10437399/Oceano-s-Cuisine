import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Alert, TextInput, KeyboardAvoidingView, Platform, Button, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const Reservation = () => {
  const navigation = useNavigation();
  const [openTableModal, setOpenTableModal] = useState(false);
  const [customerDetailsModal, setCustomerDetailModal] = useState(false);
  const [seatPrice, setSeatPrice] = useState(20);
  const currentDate = new Date();
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date); // Save selected date
    hideDatePicker();
  };

  const [customerDetails, setCustomerDetails] = useState({
    customerName: '',
    phoneNumber: '',
    emailAddress: '',
    peopleNumber: '',
  });

  
  const [reservationInfo, setReservationInfo] = useState(null);
  const [showMakeReservationButton, setShowMakeReservationButton] = useState(true); // State to control button visibility

  const handleAddToCart = () => {
    if (reservationInfo) {
      navigation.navigate('Cart', {
        peopleNumber: reservationInfo.peopleNumber,
        totalReservationPrice: seatPrice * reservationInfo.peopleNumber,
        customerDetails: reservationInfo,
        seatPrice: seatPrice, // Pass seat price for calculation
      });
    } else {
      Alert.alert("Error", "Please make a reservation first.");
    }
  };

  const toggleModal = () => {
    setOpenTableModal(!openTableModal);
  };

  const toggleChangeDetailsModal = () => {
    if (reservationInfo) {
      setCustomerDetails(reservationInfo); // Fill inputs with existing details
    }
    setOpenTableModal(true); // Open the modal
  };

  const handleInputChange = (name, value) => {
    setCustomerDetails({ ...customerDetails, [name]: value });
  };

  const validateInputs = () => {
    const { customerName, phoneNumber, emailAddress, peopleNumber } = customerDetails;
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (Object.values(customerDetails).some(field => field.trim() === '')) {
      Alert.alert("Error", "Please fill in all fields.");
      return false;
    }

    if (!phoneRegex.test(phoneNumber)) {
      Alert.alert("Error", "Phone number must be exactly 10 digits.");
      return false;
    }

    if (!emailRegex.test(emailAddress)) {
      Alert.alert("Error", "Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const toggleFinish = () => {
    if (validateInputs()) {
      Alert.alert(
        "Success",
        "Reservation details submitted!",
        [
          {
            text: "OK",
            onPress: () => {
              setReservationInfo(customerDetails);
              setCustomerDetails({
                customerName: '',
                phoneNumber: '',
                emailAddress: '',
                peopleNumber: '',
              });
              setCustomerDetailModal(false);
              toggleModal();
              setShowMakeReservationButton(false); // Hide the "Make Reservation" button
            }
          }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Add an image here */}
      <Image
        source={require('../assets/images/Reservation.webp')} // Adjust the path if necessary
        style={styles.image}
      />

      <Text style={styles.title}>Make a Reservation</Text>
      <Button title="Show Date Picker" color='grey' onPress={showDatePicker} />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        textColor='black'
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
      {selectedDate && (
        <Text style={{ marginTop: 20 }}>
          Selected Date: {selectedDate.toLocaleDateString()}
        </Text>
      )}

      {reservationInfo && (
        <View>
          <Text style={styles.reservationInfoText}>
            Reserved by {reservationInfo.customerName}
          </Text>
          <Text style={styles.reservationInfoText}>
            {reservationInfo.peopleNumber} people
          </Text>
          <Text style={styles.reservationInfoText}>
            Contact:
          </Text>
          <Text style={styles.reservationInfoText}>
          {reservationInfo.phoneNumber}
          </Text>
          <Text style={styles.reservationInfoText}>
            {reservationInfo.emailAddress}
          </Text>
          <TouchableOpacity
            style={[styles.button, { marginTop: 10 }]}
            onPress={toggleChangeDetailsModal} // Open the modal to change details
          >
            <Text style={styles.buttonText}>Change Reservation Details</Text>
          </TouchableOpacity>
        </View>
      )}

      {showMakeReservationButton && ( // Conditional rendering of the button
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={toggleModal}
        >
          <Text style={styles.buttonText}>Make Reservation</Text>
        </TouchableOpacity>
      )}

      {reservationInfo && (
        <TouchableOpacity
          style={[styles.button, { marginTop: 20 }]}
          onPress={handleAddToCart}
        >
          <Text style={styles.buttonText}>Continue to payment</Text>
        </TouchableOpacity>
      )}

      {/* Table Reservation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={openTableModal}
        onRequestClose={toggleModal}
      >
        <TouchableOpacity style={styles.modalBackground} activeOpacity={1} onPressOut={toggleModal}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <Text style={styles.modalTitle}>Table Reservation</Text>
            <Text style={styles.modalText}>Enter Customer Details:</Text>
            <TextInput
              style={styles.input}
              placeholder="Customer Name"
              placeholderTextColor={'black'}
              value={customerDetails.customerName}
              onChangeText={(text) => handleInputChange('customerName', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              keyboardType="numeric"
              placeholderTextColor={'black'}
              maxLength={10}
              value={customerDetails.phoneNumber}
              onChangeText={(text) => handleInputChange('phoneNumber', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={'black'}
              value={customerDetails.emailAddress}
              onChangeText={(text) => handleInputChange('emailAddress', text)}
            />
            <TextInput
              style={styles.input}
              placeholder="Number of people attending"
              keyboardType="numeric"
              placeholderTextColor={'black'}
              value={customerDetails.peopleNumber}
              onChangeText={(text) => handleInputChange('peopleNumber', text)}
            />
            <TouchableOpacity style={styles.button} onPress={toggleFinish}>
              <Text style={styles.buttonText}>Submit details</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  selectedDateText: {
    fontSize: 18,
    marginBottom: 10,
  },
  reservationInfoText: {
    fontSize: 18,
    marginVertical: 10,
    color: '#000000',
  },
  button: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
  },
});

export default Reservation;