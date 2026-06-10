import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper, 
  CircularProgress, 
  Card, 
  CardContent, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableRow,
  Avatar,
  Fade
} from '@mui/material';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SmartToyRoundedIcon from '@mui/icons-material/SmartToyRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import FlightTakeoffRoundedIcon from '@mui/icons-material/FlightTakeoffRounded';
import HotelRoundedIcon from '@mui/icons-material/HotelRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded';
import axios from 'axios';
import { toast } from 'react-toastify';

const BotView = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { 
      role: 'bot', 
      text: 'Hello! I am your AI Travel Concierge. I can recommend destinations, find flights, and generate a complete daily budget for you. Where would you like to go?' 
    }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  useEffect(() => scrollToBottom(), [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input;
    const currentHistory = [...messages];
    
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/bot/recommend', 
        { message: userText, history: currentHistory },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages(prev => [...prev, { role: 'bot', text: response.data.reply, data: response.data }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', text: 'I am having trouble connecting to the database right now. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTripToDashboard = async (aiData) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bot/save-trip', 
        aiData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('✨ Trip and Expenses automatically added to your dashboard!');
    } catch (error) {
      toast.error('Failed to save trip.');
    }
  };

  return (
    <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column', gap: 3, p: { xs: 1, md: 2 } }}>
      
      {/* Header matching Expense Explorer theme */}
      <Box>
        <Typography variant="h5" fontWeight="700" sx={{ color: '#6B5B95', mb: 0.5 }}>
          AI Travel Concierge
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Plan, optimize, and budget your next adventure through natural conversation.
        </Typography>
      </Box>
      
      {/* Chat History Window */}
      <Paper 
        elevation={0} 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          overflowY: 'auto', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: 3, 
          bgcolor: '#F8F9FA', // Matching your light dashboard background
          borderRadius: '24px',
          border: '1px solid #Eef0f4'
        }}
      >
        {messages.map((msg, index) => (
          <Fade in={true} key={index} timeout={500}>
            <Box 
              sx={{ 
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', 
                maxWidth: { xs: '90%', md: '75%' },
                display: 'flex',
                gap: 1.5,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
              }}
            >
              {/* Avatars */}
              <Avatar 
                sx={{ 
                  bgcolor: msg.role === 'user' ? '#3B5998' : '#ffffff', 
                  color: msg.role === 'bot' ? '#3B5998' : '#fff',
                  boxShadow: '0px 4px 10px rgba(0,0,0,0.05)',
                  width: 36, height: 36
                }}
              >
                {msg.role === 'user' ? <PersonRoundedIcon fontSize="small" /> : <SmartToyRoundedIcon fontSize="small" />}
              </Avatar>

              {/* Message Bubbles */}
              <Box>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2, 
                    bgcolor: msg.role === 'user' ? '#3B5998' : '#ffffff', // Primary blue for user
                    color: msg.role === 'user' ? '#ffffff' : '#333333',
                    borderRadius: '20px',
                    borderTopRightRadius: msg.role === 'user' ? '4px' : '20px',
                    borderTopLeftRadius: msg.role === 'bot' ? '4px' : '20px',
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.03)',
                    lineHeight: 1.6
                  }}
                >
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </Typography>
                  
                  {/* Rich Data Cards (Only show if bot sent structured data) */}
                  {msg.data && (
                    <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      
                      {msg.data.destination && (
                        <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E0E4EA' }}>
                          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: '16px !important' }}>
                            <Avatar sx={{ bgcolor: '#e8eaf6', color: '#3B5998' }}><PlaceRoundedIcon /></Avatar>
                            <Box>
                              <Typography variant="subtitle2" color="text.secondary">Recommended Destination</Typography>
                              <Typography variant="subtitle1" fontWeight="bold">{msg.data.destination.name}, {msg.data.destination.city}</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Flex container for Flight & Hotel side-by-side on desktop */}
                      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                        {msg.data.flight && (
                          <Card elevation={0} sx={{ flex: 1, borderRadius: '16px', border: '1px solid #E0E4EA' }}>
                            <CardContent sx={{ pb: '16px !important' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <FlightTakeoffRoundedIcon sx={{ color: '#3B5998', fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="bold">Flight</Typography>
                              </Box>
                              <Typography variant="body2">{msg.data.flight.carrier} ({msg.data.flight.type})</Typography>
                              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: '#2E384D' }}>₹{msg.data.flight.price}</Typography>
                            </CardContent>
                          </Card>
                        )}

                        {msg.data.hotel && (
                          <Card elevation={0} sx={{ flex: 1, borderRadius: '16px', border: '1px solid #E0E4EA' }}>
                            <CardContent sx={{ pb: '16px !important' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <HotelRoundedIcon sx={{ color: '#3B5998', fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight="bold">Accommodation</Typography>
                              </Box>
                              <Typography variant="body2" noWrap>{msg.data.hotel.name}</Typography>
                              <Typography variant="h6" fontWeight="bold" sx={{ mt: 1, color: '#2E384D' }}>₹{msg.data.hotel.pricePerNight}<Typography component="span" variant="caption">/night</Typography></Typography>
                            </CardContent>
                          </Card>
                        )}
                      </Box>

                      {/* Expenses Table */}
                      {msg.data.expenses && (
                        <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #E0E4EA', bgcolor: '#Fbfcff' }}>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <AccountBalanceWalletRoundedIcon sx={{ color: '#3B5998', fontSize: 20 }} />
                              <Typography variant="subtitle2" fontWeight="bold">Estimated Budget</Typography>
                            </Box>
                            
                            <Table size="small" sx={{ '& td, & th': { borderBottom: '1px solid #Eef0f4' } }}>
                              <TableBody>
                                {msg.data.expenses.map((exp, i) => (
                                  <TableRow key={i}>
                                    <TableCell sx={{ pl: 0, py: 1.5, color: '#4A5568' }}>{exp.item}</TableCell>
                                    <TableCell align="right" sx={{ pr: 0, py: 1.5, fontWeight: '500' }}>₹{exp.cost}</TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell sx={{ pl: 0, borderBottom: 'none', pt: 2 }}><Typography fontWeight="bold">Total Cost</Typography></TableCell>
                                  <TableCell align="right" sx={{ pr: 0, borderBottom: 'none', pt: 2 }}><Typography variant="h6" fontWeight="bold" color="primary.main">₹{msg.data.total_estimated_cost}</Typography></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>

                            {/* Automation Button */}
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                              <Button 
                                variant="contained" 
                                disableElevation
                                onClick={() => handleSaveTripToDashboard(msg.data)}
                                sx={{ 
                                  bgcolor: '#3B5998', 
                                  borderRadius: '50px', 
                                  textTransform: 'none',
                                  fontWeight: '600',
                                  px: 4,
                                  py: 1,
                                  '&:hover': { bgcolor: '#2a4378' }
                                }}
                              >
                                Save to Dashboard
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                  )}
                </Paper>
              </Box>
            </Box>
          </Fade>
        ))}
        
        {loading && (
          <Box sx={{ display: 'flex', gap: 1.5, alignSelf: 'flex-start' }}>
             <Avatar sx={{ bgcolor: '#ffffff', width: 36, height: 36, boxShadow: '0px 4px 10px rgba(0,0,0,0.05)' }}>
                <SmartToyRoundedIcon fontSize="small" sx={{ color: '#3B5998' }} />
              </Avatar>
             <Paper elevation={0} sx={{ p: 2, borderRadius: '20px', borderTopLeftRadius: '4px', display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ color: '#3B5998' }} />
             </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Paper>

      {/* Input Area */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField 
          fullWidth 
          variant="outlined"
          placeholder="e.g., Generate a 3-day budget for a trip to Jaipur..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          disabled={loading}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              bgcolor: '#ffffff',
              boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.02)',
              '& fieldset': { borderColor: '#E0E4EA' },
              '&:hover fieldset': { borderColor: '#B0B8C4' },
              '&.Mui-focused fieldset': { borderColor: '#3B5998', borderWidth: '1px' },
            }
          }}
        />
        <Button 
          variant="contained" 
          onClick={handleSend} 
          disabled={loading || !input.trim()}
          sx={{
            minWidth: '56px',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            bgcolor: '#3B5998',
            boxShadow: '0px 4px 14px rgba(59, 89, 152, 0.4)',
            '&:hover': { bgcolor: '#2a4378' }
          }}
        >
          <SendRoundedIcon />
        </Button>
      </Box>
    </Box>
  );
};

export default BotView;