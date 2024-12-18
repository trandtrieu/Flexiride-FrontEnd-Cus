import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Linking,
} from "react-native";
import { WebView } from "react-native-webview";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { IP_ADDRESS } from "@env";

const PaymentScreen = ({ route, navigation }) => {
  const { requestId } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({});
  const [paymentUrl, setPaymentUrl] = useState(null);

  // Fetch booking details
  useEffect(() => {
    const fetchDetails = async () => {
      console.log("requestId: ", requestId);
      try {
        const bookingResponse = await axios.get(
          `https://flexiride.onrender.com/booking-traditional/request/${requestId}`
        );

        if (bookingResponse.data) {
          setBookingDetails(bookingResponse.data);
        } else {
          Alert.alert("Error", "Unable to fetch booking details. ");
        }
      } catch (error) {
        console.error("Error fetching details: ", error);
        Alert.alert("Error", "Unable to fetch details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]);

  // Hiển thị trạng thái loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00BFA5" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Hiển thị WebView nếu có paymentUrl

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.paymentContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Điểm đón:</Text>
          <Text style={styles.value}>{bookingDetails.pickup}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Điểm đến:</Text>
          <Text style={styles.value}>{bookingDetails.destination}</Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Tổng chi phí:</Text>
          <Text style={styles.value}>
            {bookingDetails.price.toLocaleString("en-US", {
              style: "currency",
              currency: "VND",
            })}
          </Text>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.label}>Phương thức thanh toán:</Text>
          <Text style={styles.value}>
            {bookingDetails.payment_method === "cash"
              ? "Tiền mặt"
              : "Thanh toán online"}
          </Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() =>
          navigation.navigate("FeedbackDriverScreen", {
            driverId: bookingDetails.driverId,
            customerId: bookingDetails.account_id,
          })
        }
      >
        <Text style={styles.backButtonText}>Đánh giá</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
  },
  paymentContainer: {
    marginBottom: 20,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 18,
    color: "#333",
    marginTop: 5,
  },
  payButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#4CAF50",
    borderRadius: 50,
    marginBottom: 15,
  },
  payButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    backgroundColor: "#FFD700",
    borderRadius: 50,
  },
  backButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default PaymentScreen;
