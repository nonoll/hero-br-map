import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';

interface Column {
  id: 'number' | 'name' | 'type1' | 'type2' | 'address' | 'detailLink' | 'etc';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: any) => any;
}

const columns: Column[] = [
  {
    id: 'number',
    label: '번호'
  },
  {
    id: 'name',
    label: '이름',
  },
  {
    id: 'type1',
    label: '장르1'
  },
  {
    id: 'type2',
    label: '장르2'
  },
  {
    id: 'address',
    label: '주소'
  },
  {
    id: 'detailLink',
    label: '상세페이지'
  },
  {
    id: 'etc',
    label: '비고'
  }
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

interface IStickyHeadTableParams {
  rows: any[];
  handleRowClick: any;
}

export default function StickyHeadTable({ rows = [], handleRowClick }: IStickyHeadTableParams) {
  const classes = useStyles();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(50);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper className={classes.root}>
      <TableContainer className={classes.container}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.key} onClick={(event) => handleRowClick(event, row)}>
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {
                          column.id === 'detailLink' && value
                            ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                            : column.format && typeof value === 'number' ? column.format(value) : value
                        }
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onChangePage={handleChangePage}
        onChangeRowsPerPage={handleChangeRowsPerPage}
      />
    </Paper>
  );
}