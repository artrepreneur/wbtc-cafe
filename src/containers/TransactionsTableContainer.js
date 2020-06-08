import React from 'react';
import { withStore } from '@spyna/react-store'
import { withStyles } from '@material-ui/styles';
import theme from '../theme/theme'

import { initLocalWeb3 } from '../utils/walletUtils'
import ConversionStatus from '../components/ConversionStatus';
import ConversionActions from '../components/ConversionActions';
import ActionLink from '../components/ActionLink';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

const styles = () => ({
    container: {
        background: '#fff',
        border: '0.5px solid ' + theme.palette.divider,
        minHeight: 200,
        height: '100%'
    },
    titleWrapper: {
      paddingBottom: theme.spacing(2)
    },
    actionsCell: {
      minWidth: 150
    },
    emptyMessage: {
      display: 'flex',
      paddingTop: theme.spacing(8),
      justifyContent: 'center',
      height: '100%'
    }
})

class TransactionsTableContainer extends React.Component {

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
    }

    cancel() {

    }

    render() {
        const {
            classes,
            store
        } = this.props

        const selectedNetwork = store.get('selectedNetwork')
        const transactions = store.get('convert.transactions')
            .filter(t => t.sourceNetworkVersion === selectedNetwork)
        const localWeb3Address = store.get('localWeb3Address')
        const loadingTransactions = store.get('loadingTransactions')
        const spaceError = store.get('spaceError')


        return <div className={classes.container}>
          {/*<div className={classes.titleWrapper}>
            <Typography variant='subtitle1'><b>Conversions</b></Typography>
          </div>*/}
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell align="left">Transaction</TableCell>
                <TableCell>Status</TableCell>
                {/*<TableCell align="left">Date</TableCell>*/}
                <TableCell><div className={classes.actionsCell}></div></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {localWeb3Address && !loadingTransactions && transactions.map((tx, i) => {
                const destAsset = tx.swapReverted ? 'RENBTC' : tx.destAsset.toUpperCase()
                const sourceAsset = tx.sourceAsset.toUpperCase()
                return <TableRow key={i}>
                  <TableCell align="left"><Typography variant='caption'>{tx.sourceAmount ? tx.sourceAmount : tx.amount} {sourceAsset} → {destAsset}</Typography></TableCell>
                  <TableCell><Typography variant='caption'><ConversionStatus tx={tx} /></Typography></TableCell>
                  <TableCell>
                      <Grid container justify='flex-end'>
                        <ConversionActions tx={tx} />
                      </Grid>
                  </TableCell>
                </TableRow>
              })}
            </TableBody>
          </Table>
          {!localWeb3Address && <div className={classes.emptyMessage}>
              <Typography variant='caption'>Please <ActionLink onClick={initLocalWeb3}>connect wallet</ActionLink> to view transactions</Typography>
          </div>}
          {loadingTransactions && <div className={classes.emptyMessage}>
              {spaceError ? <Typography variant='caption'>Sign in failed. <ActionLink onClick={initLocalWeb3}>Retry</ActionLink></Typography> : <Typography variant='caption'>Loading transactions...</Typography>}
          </div>}
          {localWeb3Address && !loadingTransactions && !transactions.length && <div className={classes.emptyMessage}>
              <Typography variant='caption'>No transactions</Typography>
          </div>}
          {/*localWeb3Address && !transactions.length && <div className={classes.emptyMessage}>
              <Typography variant='caption'>No transactions</Typography>
          </div>*/}
        </div>
    }
}

export default withStyles(styles)(withStore(TransactionsTableContainer))
