import React, { useEffect } from "react";
import { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

const SplashScreen = () => {
	const [loadingProgress, setLoadingProgress] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setLoadingProgress((prev) => {
				if (prev >= 100) {
					clearInterval(timer);
					return 100;
				}
				return prev + 2;
			});
		}, 50);

		return () => clearInterval(timer);
	}, []);

	return (
		<View style={styles.container}>
			{/* Main content */}
			<View style={styles.content}>
				{/* App icon container */}
				<View style={styles.iconContainer}>
					<View style={styles.iconPulse} />
					<View style={styles.iconInner} />
					<View style={styles.iconTextContainer}>
						<Text style={styles.iconText}>B</Text>
					</View>
				</View>

				{/* App name */}
				<View style={styles.titleContainer}>
					<Text style={styles.title}>HELLO, BUDD!</Text>
					<Text style={styles.subtitle}>LEVEL UP YOUR FINANCES</Text>
				</View>

				{/* Loading bar */}
				<View style={styles.loadingContainer}>
					<View style={styles.loadingBar}>
						<View
							style={[
								styles.loadingProgress,
								{ width: `${loadingProgress}%` },
							]}
						/>
					</View>
					<Text style={styles.loadingText}>{loadingProgress}%</Text>
				</View>
			</View>

			{/* Bottom text */}
			<Text style={styles.bottomText}>INITIALIZING FINANCIAL SYSTEMS...</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#111827', // bg-gray-900
		alignItems: 'center',
		justifyContent: 'center',
	},
	content: {
		alignItems: 'center',
		gap: 32,
		zIndex: 10,
	},
	iconContainer: {
		width: 128,
		height: 128,
		position: 'relative',
	},
	iconPulse: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: '#00BCD4', // cyan-400
		opacity: 0.2,
		borderRadius: 12,
	},
	iconInner: {
		position: 'absolute',
		top: 8,
		left: 8,
		right: 8,
		bottom: 8,
		backgroundColor: '#1F2937', // gray-800
		borderRadius: 8,
	},
	iconTextContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: 'center',
		justifyContent: 'center',
	},
	iconText: {
		color: '#00BCD4', // cyan-400
		fontSize: 48,
		fontWeight: 'bold',
	},
	titleContainer: {
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		color: 'white',
		marginBottom: 8,
	},
	subtitle: {
		color: '#00BCD4', // cyan-400
		fontSize: 14,
	},
	loadingContainer: {
		width: 256,
	},
	loadingBar: {
		height: 4,
		backgroundColor: '#374151', // gray-700
		borderRadius: 2,
		overflow: 'hidden',
	},
	loadingProgress: {
		height: '100%',
		backgroundColor: '#00BCD4', // cyan-400
		borderRadius: 2,
	},
	loadingText: {
		marginTop: 8,
		textAlign: 'right',
		fontSize: 12,
		color: '#00BCD4', // cyan-400
	},
	bottomText: {
		position: 'absolute',
		bottom: 32,
		color: '#6B7280', // gray-500
		fontSize: 12,
	},
});

export default SplashScreen;
