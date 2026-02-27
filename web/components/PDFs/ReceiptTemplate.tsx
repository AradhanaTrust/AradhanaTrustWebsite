import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Image,
    Font
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        backgroundColor: '#fff',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: '#D4AF37',
        borderBottomStyle: 'solid',
        paddingBottom: 20,
        marginBottom: 30,
    },
    logo: {
        width: 80,
        height: 80,
    },
    titleContainer: {
        alignItems: 'flex-end',
    },
    trustName: {
        fontSize: 22,
        color: '#D4AF37',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    trustDetails: {
        fontSize: 10,
        color: '#666',
        maxWidth: 250,
        textAlign: 'right',
    },
    receiptLabel: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a1a1a',
        marginBottom: 20,
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
    section: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        borderBottomStyle: 'solid',
        paddingBottom: 10,
    },
    row: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    label: {
        width: 150,
        fontSize: 12,
        color: '#666',
        fontWeight: 'bold',
    },
    value: {
        flex: 1,
        fontSize: 12,
        color: '#1a1a1a',
    },
    amountContainer: {
        marginTop: 20,
        padding: 15,
        backgroundColor: '#fdfcf0',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: '#D4AF37',
        borderRadius: 4,
    },
    amountRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    amountLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#D4AF37',
    },
    amountValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    footer: {
        position: 'absolute',
        bottom: 40,
        left: 40,
        right: 40,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        borderTopStyle: 'solid',
        paddingTop: 10,
        textAlign: 'center',
    },
    footerText: {
        fontSize: 9,
        color: '#999',
    },
    signature: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    sigLine: {
        width: 150,
        borderTopWidth: 1,
        borderTopColor: '#000',
        borderTopStyle: 'solid',
        textAlign: 'center',
        paddingTop: 5,
    },
    sigText: {
        fontSize: 10,
        color: '#666',
    }
});

interface ReceiptData {
    receiptType: 'Registration' | 'Donation';
    receiptNo: string;
    date: string;
    userName: string;
    email: string;
    phone?: string;
    eventTitle?: string;
    amount: number;
    paymentStatus: string;
    details?: string;
}

export const ReceiptTemplate = ({ data }: { data: ReceiptData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Header */}
            <View style={styles.header}>
                <Image
                    src="https://aradhanatrust.org/assets/Logo_Main.png" // Fallback to absolute URL if local fails in server render
                    style={styles.logo}
                />
                <View style={styles.titleContainer}>
                    <Text style={styles.trustName}>ARADHANA TRUST</Text>
                    <Text style={styles.trustDetails}>
                        Helping Hands for Divine Service{"\n"}
                        Visit us: www.aradhanatrust.org{"\n"}
                        Contact: +91 9110825363
                    </Text>
                </View>
            </View>

            {/* Receipt Type */}
            <Text style={styles.receiptLabel}>
                {data.receiptType} Receipt
            </Text>

            {/* Main Info */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Receipt Number:</Text>
                    <Text style={[styles.value, { fontWeight: 'bold' }]}>{data.receiptNo}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Date:</Text>
                    <Text style={styles.value}>{data.date}</Text>
                </View>
            </View>

            {/* User Details */}
            <View style={styles.section}>
                <View style={styles.row}>
                    <Text style={styles.label}>Member Name:</Text>
                    <Text style={styles.value}>{data.userName}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Email Address:</Text>
                    <Text style={styles.value}>{data.email}</Text>
                </View>
                {data.phone && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Phone Number:</Text>
                        <Text style={styles.value}>{data.phone}</Text>
                    </View>
                )}
            </View>

            {/* Event/Activity Details */}
            <View style={styles.section}>
                {data.eventTitle && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Event/Activity:</Text>
                        <Text style={styles.value}>{data.eventTitle}</Text>
                    </View>
                )}
                <View style={styles.row}>
                    <Text style={styles.label}>Payment Status:</Text>
                    <Text style={[styles.value, { color: data.paymentStatus === 'Paid' || data.paymentStatus === 'Registered' ? 'green' : 'orange' }]}>
                        {data.paymentStatus}
                    </Text>
                </View>
            </View>

            {/* Amount */}
            <View style={styles.amountContainer}>
                <View style={styles.amountRow}>
                    <Text style={styles.amountLabel}>Total Amount:</Text>
                    <Text style={styles.amountValue}>INR {data.amount.toLocaleString('en-IN')}.00</Text>
                </View>
            </View>

            {/* Signature Area */}
            <View style={styles.signature}>
                <View style={styles.sigLine}>
                    <Text style={styles.sigText}>Authorized Signatory</Text>
                    <Text style={[styles.sigText, { fontSize: 8 }]}>Aradhana Trust</Text>
                </View>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    This is a computer-generated receipt. No physical signature required.{"\n"}
                    Aradhana Trust is a registered charitable trust. Thank you for your contribution.
                </Text>
            </View>
        </Page>
    </Document>
);
