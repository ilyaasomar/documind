import { styles } from "@/app/styles";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const memberData = [
  {
    id: 1,
    name: "John Doe",
    role: "Owner",
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Member",
    lastActive: "1 day ago",
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Member",
    lastActive: "3 days ago",
  },
  {
    id: 4,
    name: "Emily Davis",
    role: "Admin",
    lastActive: "1 week ago",
  },
  {
    id: 5,
    name: "William Brown",
    role: "Member",
    lastActive: "2 weeks ago",
  },
];
export function MemberTable() {
  return (
    <Table className="w-full">
      <TableHeader>
        <TableRow className="text-muted-foreground">
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Last active</TableHead>
          <TableHead className="text-center">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {memberData.map((member) => (
          <TableRow key={member.id} className="text-muted-foreground">
            <TableCell className="font-medium">{member.name}</TableCell>
            <TableCell>
              {member.role === "Admin" || member.role === "Owner" ? (
                <Badge
                  className={`bg-primary dark:${styles.primaryBgColor} text-white rounded-sm`}
                >
                  {member.role}
                </Badge>
              ) : (
                <Badge variant="destructive" className="rounded-sm">
                  {member.role}
                </Badge>
              )}
            </TableCell>
            <TableCell>{member.lastActive}</TableCell>
            <TableCell>
              <div className="flex items-center justify-center gap-x-2 mr-1">
                <Button
                  type="button"
                  size="sm"
                  className={`hover:bg-primary text-white px-2 dark:${styles.primaryHoverBgColor} dark:${styles.primaryBgColor} cursor-pointer font-normal`}
                >
                  Edit
                </Button>

                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  className=" px-2 cursor-pointer font-normal text-red-600 hover:text-red-600"
                  // onClick={() => setOpen(true)}
                >
                  Remove
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
