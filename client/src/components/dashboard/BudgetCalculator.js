// === SECTION TO MODIFY ===
  // Pre-fill from tripData the first time the drawer opens
  React.useEffect(() => {
    if (open && tripData) {
      dispatch(
        setBudgetInputs({
          destination: tripData.destination || inputs.destination,
          days: tripData.duration || inputs.days,
          travelers: tripData.travelers || inputs.travelers,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

// === REPLACE WITH ===
  // Pre-fill from tripData when the drawer opens, and keep inputs in sync
  // whenever the underlying trip information changes while mounted/open.
  React.useEffect(() => {
    if (open && tripData) {
      dispatch(
        setBudgetInputs({
          destination: tripData.destination || inputs.destination,
          days: tripData.duration || inputs.days,
          travelers: tripData.travelers || inputs.travelers,
        }),
      );
    }
    // We intentionally depend on the specific tripData fields we consume
    // (rather than the tripData object reference, which may be recreated
    // on every parent render) so that live edits to the trip - made while
    // this calculator is already mounted - trigger a re-sync and the
    // budget recalculates instead of showing stale values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, tripData?.destination, tripData?.duration, tripData?.travelers]);