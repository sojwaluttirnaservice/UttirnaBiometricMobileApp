'use client';
import { CameraType, CameraView, useCameraPermissions } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
	View,
	Text,
	Button,
	StyleSheet,
	TouchableOpacity,
	Platform,
} from 'react-native';
import CryptoJS from 'crypto-js';
import CandidateInfo from '../candidate/info';
import axios from 'axios';
import {
	errorToast,
	successToast,
} from '../../components/helper/toasts/Toasts';

const ScanQrPage = () => {
	const [facing, setFacing] = useState('back');
	const [permission, requestPermission] = useCameraPermissions();

	const [scannedData, setScannedData] = useState(null);
	const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
	const [isCameraOpen, setIsCameraOpen] = useState(false);
	const [hallticketData, setHallticketData] = useState(null);
	const [isScanning, setIsScanning] = useState(false);

	useEffect(() => {
		return () => {
			setScannedData(null);
			setIsQRScannerOpen(false);
		};
	}, []);

	const decrypt = (encryptedData, secretKey) => {
		const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
		const originalText = bytes.toString(CryptoJS.enc.Utf8);
		return originalText;
	};

	const handleBarcodeScan = async ({ data: barcodeData }) => {
		if (isScanning) return;
		setIsScanning(true);

		try {
			const decryptedUrlData = decrypt(barcodeData, 'form-filling-secret-key');
			setScannedData(decryptedUrlData);

			console.log(decryptedUrlData);
			const { data: _data } = await axios.post(decryptedUrlData);
			setHallticketData(JSON.parse(_data.data));
			successToast({ title: 'QR', message: 'Qr Scanned successfully' });
			setIsQRScannerOpen(false);
		} catch (err) {
			console.log(err);
		} finally {
			setIsScanning(false);
		}
	};

	function toggleCameraFacing() {
		setFacing((current) => (current === 'back' ? 'front' : 'back'));
	}

	if (!permission) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					This is the camera view. Please grant the necessary permissions to
					proceed.
				</Text>
			</View>
		);
	}

	if (!permission.granted) {
		return (
			<View style={styles.container}>
				<Text style={styles.message}>
					We need your permission to access the camera
				</Text>
				<Button onPress={requestPermission} title="Grant Permission" />
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{Platform.OS === 'android' ? <StatusBar /> : null}
			{isQRScannerOpen && (
				<CameraView
					style={styles.camera}
					facing={facing}
					onBarcodeScanned={handleBarcodeScan}
				>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={[styles.flipButton, styles.scannerButton]}
							onPress={toggleCameraFacing}
						>
							<Text style={[styles.text, styles.scannerButtonText]}>
								Flip Camera
							</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[styles.closeButton, styles.scannerButton]}
							onPress={() => setIsQRScannerOpen(false)}
						>
							<Text style={[styles.text, styles.scannerButtonText]}>
								Close Scanner
							</Text>
						</TouchableOpacity>
					</View>
				</CameraView>
			)}

			{/* Render Info component conditionally based on scanned data */}
			{!isQRScannerOpen && scannedData && hallticketData && (
				<CandidateInfo
					hallticketData={hallticketData}
					sourceUrl={scannedData}
					isCameraOpen={isCameraOpen}
					setIsCameraOpen={setIsCameraOpen}
				/>
			)}

			{!isQRScannerOpen && !scannedData && (
				<TouchableOpacity
					style={styles.scanQRButtonCenter}
					onPress={() => {
						setScannedData(null);
						setIsQRScannerOpen(true);
					}}
				>
					<Text style={styles.scanQRButtonText}>Scan QR</Text>
				</TouchableOpacity>
			)}

			{!isQRScannerOpen && !isCameraOpen && scannedData && (
				<View style={styles.buttonWrapper}>
					<TouchableOpacity
						style={styles.scanQRButton}
						onPress={() => {
							setScannedData(null);
							setIsQRScannerOpen(true);
						}}
					>
						<Text style={styles.scanQRButtonText}>Scan QR</Text>
					</TouchableOpacity>
				</View>
			)}
		</View>
	);
};

export default ScanQrPage;

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'flex-start',
	},
	message: {
		textAlign: 'center',
		paddingBottom: 10,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		position: 'absolute',
		bottom: 40,
		left: 20,
		right: 20,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	buttonWrapper: {
		marginTop: 'auto',
	},
	scanQRButtonCenter: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: [{ translateX: -75 }, { translateY: -75 }],
		width: 150,
		height: 150,
		borderRadius: 75,
		backgroundColor: '#0ea5e9',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.2,
		shadowRadius: 5,
	},
	scanQRButton: {
		backgroundColor: '#0ea5e9',
		paddingVertical: 12,
		paddingHorizontal: 30,
		color: 'white',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
	},
	scanQRButtonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 19,
		textTransform: 'uppercase',
		letterSpacing: 1,
		textAlign: 'center',
	},
	scannerButton: {
		paddingVertical: 16,
		paddingHorizontal: 15,
		borderRadius: 25,
		alignItems: 'center',
		justifyContent: 'center',
		minWidth: 120,
	},
	flipButton: {
		backgroundColor: '#007BFF',
		display: 'none',
	},
	closeButton: {
		backgroundColor: '#DC3545',
	},
	text: {
		color: '#FFF',
		fontSize: 14,
		fontWeight: '600',
	},
	scannerButtonText: {
		color: '#FFF',
	},
});
