import React from "react";
//import ExpenseCard from "./ExpenseCard";
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const BudgetBreakdown = ({
  hotelCost,
  transportCost,
  foodCost,
  activitiesCost,
  miscCost,
  total,
  form,
  currency,
  currencySymbols,
  convertCurrency,
}) => {
  return (
    <Card
      sx={{
        border: "1px solid #e0e0e0",
        borderRadius: "20px",
        background: "rgba(251, 251, 251, 0.86)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 15px 40px rgba(0,0,0,0.10)",
        mb: 4,
      }}
    >
      <CardContent>
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Cost Breakdown
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Calculation</TableCell>
                <TableCell>Total</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>Accommodation</TableCell>
                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(hotelCost).toLocaleString()}
                  {" × "}
                  {form.days}
                  {" × "}
                  {form.travelers}
                </TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(
                    hotelCost * form.days * form.travelers,
                  ).toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Transport</TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(transportCost).toLocaleString()}
                  {" × "}
                  {form.days}
                  {" × "}
                  {form.travelers}
                </TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(
                    transportCost * form.days * form.travelers,
                  ).toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Food</TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(foodCost).toLocaleString()}
                  {" × "}
                  {form.days}
                  {" × "}
                  {form.travelers}
                </TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(
                    foodCost * form.days * form.travelers,
                  ).toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Activities</TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(activitiesCost).toLocaleString()}
                  {" × "}
                  {form.days}
                  {" × "}
                  {form.travelers}
                </TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(
                    activitiesCost * form.days * form.travelers,
                  ).toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell>Miscellaneous</TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(miscCost).toLocaleString()}
                  {" × "}
                  {form.days}
                  {" × "}
                  {form.travelers}
                </TableCell>

                <TableCell>
                  {currencySymbols[currency]}
                  {convertCurrency(
                    miscCost * form.days * form.travelers,
                  ).toLocaleString()}
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2}>
                  <strong>Grand Total</strong>
                </TableCell>

                <TableCell>
                  <strong>
                    {currencySymbols[currency]}
                    {convertCurrency(total).toLocaleString()}
                  </strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default BudgetBreakdown;
